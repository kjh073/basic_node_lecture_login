const express = require('express') //express 모듈 가져옴
const app = express() //함수를 이용해 새로운 app을 만듦
const port = 3000 //3000번 포트를 백서버로 둠
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./models/User'); //이전에 만든 모델 가져오기
const { auth } = require('./middleware/auth');

//body-parser에 옵션 주기
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있도록
app.use(bodyParser.json()); //application/json 데이터를 분석해서 가져올 수 있도록
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected ...'))
	.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 안녕하세요')) //'/'디렉토리에 오면 Hello World 출력

app.post('/api/user/register', (req, res) => {
	//회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어줌

	const user = new User(req.userInfo) //정보들을 DB에 넣기 위함 req.body에는 {id: "idid", pwd: "pwd"} 이런 식으로 들어있음
									//이 정보가 들어있을 수 있는건 const bodyParser = require('body-parser'); 이 문장을 써줬기 때문
	user.save((err, doc) => { //db에서 오는 method들을 save해주면 정보들이 user model에 저장됨
		if(err) return res.json({ success: false, err }) //에러가 뜬다면 json형식으로 err msg와 함게 전달해줌
		return res.status(200).json({ //200은 성공했다는 뜻
			success: true
		})
	})
})

app.post('/api/user/login', (req, res) => {
	//로그인 요청된 이메일이 DB에 있는지 확인
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) { //user collection 안에 전달된 이메일을 가진 유저가 없다면
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다."
		})
	}
	//요청된 이메일이 DB에 있다면 pwd가 일치하는지 확인
	user.comparePassword(req.body.password,  (err, isMatch) => {
		if (!isMatch)
		return res.json({ 
			loginSuccess: false, 
			message: "비밀번호가 틀렸습니다."})
	})
	//일치한다면 토큰 생성
	user.generateToken((err, user) => {
		if (err) return res.status(400).send(err); //400: 에러났다는 상태
		//토큰을 쿠키, 로컬스토리지 등에 저장할 수 있는데 쿠키에 저장
		res.cookie("x_auth", user.token)
		.status(200)
		.json({ loginSuccess : true, useId: user._id })
	})

	})
})

//role 0 => 일반 유저 0이 아니면 관리자
app.get('/api/user/auth', auth, (req, res) => { //end point에서 리퀘스트를 받은 다음 cb function을 하기 전에 중간에서 무언가를 해주는 것이 middleware
	req.user
	req.token 
	//(req, res)에 왔다는건 middleware를 성공적으로 통과했다는 얘기
	//false라면 return에서 다른 곳으로 빠져나감
	//여기까지 미들웨어를 통과했다는건 authentication: true
	res.status(200).json({ //정보를 주면 어떤 페이지에서도 정보를 이용할 수 있기 때문에 편리함
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name, 
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image
	})
})

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id}, //middleware에서 가져와 찾을 수 o
	{ token: "" }, (err, user) => {
		if (err) return res.json({ success: false, err});
		return res.status(200).send({
			success: true
		})
	})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) //3000번 포트에서 실행