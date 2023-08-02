import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'
// import { useNavigate } from 'react-router-dom'
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function LoginPage(props) {
	const dispatch = useDispatch();
	let navigate = useNavigate();
	const params = useParams();
	const location = useLocation();
	// const navigate = useNavigate();

	const [Email, setEmail] = useState("") //서버에 보내고자하는 값들을 state에서 받음
	const [Password, setPassword] = useState("")

	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value)
	}

	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value)
	}
	const onSubmitHadler = (event) => {
		event.preventDefault(); //없으면 매번 페이지가 리프레쉬됨

		console.log('Email', Email)
		console.log('Password', Password)

		let body = {
			email: Email,
			password: Password
		}
		dispatch(loginUser(body))
			.then(response => {
				if (response.payload.loginSuccess) {
					navigate('/') //페이지 이동
				} else {
					alert('Error')
				}
			})

	}
	return (
	<div style={{
		display: 'flex', justifyContent: 'center', alignItems: 'center', 
		width: '100%', height: '100vh'
	}}>
		<form style={{
			display: 'flex', flexDirection:'column'}}
			onSubmit={onSubmitHadler}
		>
			<label>Email</label>
			<input type="email" value={Email} onChange={onEmailHandler} />
			<label>Password</label>
			<input type="password" value={Password} onChange={onPasswordHandler} />
			<br />
			<button>
				Login
			</button>
		</form>
	</div>
  )
}

export default LoginPage