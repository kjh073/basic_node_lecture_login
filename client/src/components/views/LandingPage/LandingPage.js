import React, { useEffect } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom'
import { useParams, useLocation, useNavigate } from 'react-router-dom';


function LandingPage() {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
	  axios.get('/api/hello')
	  .then(response=> { console.log(response.data) })

	}, [])
	// let navigate = useNavigate();

	const onClickHandler = () => {
		axios.get('/api/users/logout')
		.then(response => {
			if(response.data.success) {
				navigate('/login') //페이지 이동
			} else {
				alert('로그아웃 실패')
			}
		})
	}
	
  return (
	<div style={{
		display: 'flex', justifyContent: 'center', alignItems: 'center', 
		width: '100%', height: '100vh'
	}}>
		<h2>시작페이지</h2>
	<button onClick={onClickHandler}>
		로그아웃
	</button>
	</div>
  )
}

export default LandingPage