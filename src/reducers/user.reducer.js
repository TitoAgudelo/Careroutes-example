import { userConstants } from '../constants';

const initialState = {
  user: {},
  currentUser: {},
	searchField: {},
	message: ''
}

export default function(state = initialState, action){
	switch(action.type){
		case userConstants.SET_SEARCH:
			return {
				...state,
				searchField: action.payload.search
			};
    default:
      return state
	}
}