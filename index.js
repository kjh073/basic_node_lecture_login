const express = require('express') //express 모듈 가져옴
const app = express() //함수를 이용해 새로운 app을 만듦
const port = 3000 //3000번 포트를 백서버로 둠
const bodyParser = require('body-parser');
const { User } = require("./models/User"); //이전에 만든 모델 가져오기
const config = require('./config/key');

//body-parser에 옵션 주기
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있도록
app.use(bodyParser.json()); //application/json 데이터를 분석해서 가져올 수 있도록

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected ...'))
	.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 안녕하세요')) //'/'디렉토리에 오면 Hello World 출력

app.post('/register', (req, res) => {
	//회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어줌

	const user = new User(req.body) //정보들을 DB에 넣기 위함 req.body에는 {id: "idid", pwd: "pwd"} 이런 식으로 들어있음
									//이 정보가 들어있을 수 있는건 const bodyParser = require('body-parser'); 이 문장을 써줬기 때문
	user.save((err, doc) => { //db에서 오는 method들을 save해주면 정보들이 user model에 저장됨
		if(err) return res.json({ success: false, err}) //에러가 뜬다면 json형식으로 err msg와 함게 전달해줌
		return res.status(200).json({ //200은 성공했다는 뜻
			success: true
		})
	})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) //3000번 포트에서 실행