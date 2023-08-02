import axios from "axios";
import {
	LOGIN_USER, 
	REGISTER_USER,
	AUTH_USER
} from './types';

export function loginUser(dataTosubmit) {

	const request = axios.post('/api/user/login', dataTosubmit) //서버로 내용 보내기
	.then(response => response.data ) //서버에서 받은 데이터를 리퀘스트에 저장
	return {
		type: LOGIN_USER, 
		payload: request
	}
}

export function registerUser(dataTosubmit) {

	const request = axios.post('/api/user/register', dataTosubmit) //서버로 내용 보내기
	.then(response => response.data ) //서버에서 받은 데이터를 리퀘스트에 저장
	return {
		type: REGISTER_USER, 
		payload: request
	}
}

// get 메소드라 body 부분은 필요 없음
export function auth() {

	const request = axios.get('/api/user/auth') //서버로 내용 보내기
	.then(response => response.data ) //서버에서 받은 데이터를 리퀘스트에 저장
	return {
		type: AUTH_USER, 
		payload: request
	}
}