//mongoose 모듈 가져옴
const mongoose = require('mongoose');
const bcypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


//mongoose를 이용해 schema 생성
const userSchema  = mongoose.Schema({
	name: {
		type: String, 
		maxlength: 50
	}, 
	email: {
		type: String,
		trim: true, //중간에 들어간 space 삭제
		unique: 1 //똑같은 이메일 쓰지 못하게
	}, 
	password: {
		type: String,
		minlength: 5,
	}, 
	lastname: {
		type: String,
		maxlength: 50
	},
	role: { //어떤 유저가 관리자가 될 수 있고, 일반 유저가 될 수 있기에 구분
		type: Number, 
		default: 0
	}, 
	image: String, 
	token: { //유효성 관리
		type : String
	},
	tokenExp: { //토큰을 사용할 수 있는 기한
		type: Number
	}
}) 

userSchema.pre('save', function( next ){ //.pre: mongoose에서 가져온 메소드 저장하기 전에 function을 실행 후 다 끝나면 user.save((err, doc)줄 부터 실행
	var user = this; //위의 schema를 가리킴

	if(user.isModified('password')) { //이 조건문이 없다면 pwd가 아닌 다른 요소가 바뀌었을 때도 pwd를 다시 암호화 해줌
		//비밀번호 암호화
		bcypt.genSalt(saltRounds, function(err, salt){
			if(err) return next(err)
	
			bcypt.hash(user.password, salt, function(err, hash){ //hash: 암호화된 비밀번호
				if(err) return next(err)
				user.password = hash //plain pwd를 hash된 비밀번호로 교체
				next()
			})
		})
	} else { //pwd가 바뀌지 않았을 때 그냥 next로 전달
		next()
	}
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
	//pwd가 맞는지 비교하기 위해서는 plainPwd를 암호화해서 이미 암호화된 비밀번호(hash)와 비교해야함, 암호화된걸 다시 복호화할 수는 없음
	bcypt.compare(plainPassword, this.password, function(err, isMatch) {
		if (err) return cb(err), //같지 않다면 err
		cb(null, isMatch) //같다면 에러는 null, isMatch(true): 비밀번호는 같다
	})
}

userSchema.methods.generateToken = function(cb) {
	var user = this;
	//jsonwebtoken을 이용해 토큰 생성
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	//user._id + 'secretToken' = token
	//token 해석할 때 secretToken를 넣으면 user._id이 해석됨
	user.token = token
	user.save (function(err, user) {
		if (err) return cb(err)
		cb(null, user)
	})
}

userSchema.statics.findByToken = function(token, cb) {
	var user = this;

	//토큰 디코드
	jwt.verify(token, 'secretToken', function(err, decoded) {
		//유저 아이디를 이용해서 유저 찾은 후 클라이언트에서 가져온 토큰과 db의 토큰이 일치하는지 확인
		user.findOne({ "_id": decoded, "token": token }, function (err, user) {
			if (err) return cb(err);
			cb(null, user)
		})
	})
}

const User = mongoose.model('User', userSchema) //schema를 모델로 감싸줌

module.exports = { User } //user를 다른 곳에서도 쓸 수 있도록