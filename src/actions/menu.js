import { menuConstants } from './../constants';

const setMenu = (view, newState) => {
  let payload = {}
  payload[view] = newState
  return {
    type: menuConstants.SET_MENU,
    payload
  }
}

const toggleMenu = () => ({
  type: menuConstants.MENU_TOGGLE
})

export const menuActions = {
  setMenu,
  toggleMenu
};
