import { menuConstants } from './../constants';

export const initialState = {
  showMenu: false
}

function toggleMenu (state) {
  var newState = Object.assign({}, state)
  newState.showMenu = !newState.showMenu
  return newState;
}

export default function menuReducer(state = initialState, action) {
  if (action && action.type) {
    switch (action.type) {
      case menuConstants.SET_MENU:
        return Object.assign({}, state, action.payload)
      case menuConstants.MENU_TOGGLE:
        return toggleMenu(state);
      default:
        return state
    }
  }
  return state
}
