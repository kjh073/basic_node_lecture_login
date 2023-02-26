import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action'
import { useNavigate } from 'react-router-dom'

function RegisterPage(props) {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const [Email, setEmail] = useState("") //서버에 보내고자하는 값들을 state에서 받음
	const [Password, setPassword] = useState("")
	const [Name, setName] = useState("")
	const [ConfirmPassword, setConfirmPassword] = useState("")

	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value)
	}

	const onNameHandler = (event) => {
		setName(event.currentTarget.value)
	}

	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value)
	}

	const onConfirmPasswordHandler = (event) => {
		setConfirmPassword(event.currentTarget.value)
	}

	const onSubmitHadler = (event) => {
		event.preventDefault(); //없으면 매번 페이지가 리프레쉬됨

		console.log('Email', Email)
		console.log('Password', Password)

		if (Password !== ConfirmPassword) {
			return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
		}

		let body = {
			email: Email,
			name: Name,
			password: Password
		}

		dispatch(registerUser(body))
			.then(response => {
				if(response.payload.success) {
					navigate('/login') //페이지 이동
				} else {
					alert('failed to sign up')
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

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
		
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button>
          회원 가입
        </button>
      </form>
    </div>
  )
}

export default RegisterPage