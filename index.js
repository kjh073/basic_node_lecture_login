const express = require('express') //express 모듈 가져옴
const app = express() //함수를 이용해 새로운 app을 만듦
const port = 3000 //3000번 포트를 백서버로 둠

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jooheekim:abcd1234@bolierplate.cpnpx10.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => console.log('MongoDB Connected ...')).catch(err => console.log)



app.get('/', (req, res) => res.send('Hello World!')) //'/'디렉토리에 오면 Hello World 출력
app.listen(port, () => console.log(`Example app listening on port ${port}!`)) //3000번 포트에서 실행