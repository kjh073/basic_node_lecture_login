import {
	LOGIN_USER, 
	REGISTER_USER,
	AUTH_USER_USER
} from '../_actions/types';

export default function (state = {}, action) {
	switch (action.type) {
		case LOGIN_USER:
			return {...state, loginSuccess: action.payload }
		case REGISTER_USER:
			return {...state, register: action.payload }
		case REGISTER_USER:
			return {...state, userDate: action.payload }
		default:
			return state;
			
	}
}