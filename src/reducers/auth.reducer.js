import { userConstants } from '../constants';

const initialState = {
	isAuthenticated: false,
  user: {},
  currentUser: {},
	errors: {},
	message: '',
	messageFailure: ''
}

export default function(state = initialState, action){
	switch(action.type) {
		case userConstants.AUTH_USER:
			return { ...state, isAuthenticated: true, user: action.payload };
		case userConstants.UNAUTH_USER:
			return { ...state, isAuthenticated: false, user: action.payload };
		case userConstants.AUTH_ERROR:
      return { ...state, errors: action.payload };
		case userConstants.FETCH_MESSAGE:
			return { ...state, message: action.payload };
    case userConstants.SET_USER:
      return { ...state, currentUser: action.payload };
		case userConstants.SET_PASSWORD_FAILURE:
			return { ...state, messageFailure: action.payload.message };
    default:
      return state;
	}
}