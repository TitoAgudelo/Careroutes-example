import { userConstants } from '../constants';

const initialState = {};

export default function(state = initialState, action) {
  switch(action.type) {
    case userConstants.AUTH_ERROR:
      return action.payload;
    default:
      return state;
  }
};