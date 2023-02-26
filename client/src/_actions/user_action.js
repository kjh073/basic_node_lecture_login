import axios from "axios";
import {
	LOGIN_USER
} from './types';

export function loginUser(dataTosubmit) {

	const request = axios.post('/api/user/login', dataTosubmit) //서버로 내용 보내기
	.then(response => response.data ) //서버에서 받은 데이터를 리퀘스트에 저장
	return {
		type: LOGIN_USER, 
		payload: request
	}
}