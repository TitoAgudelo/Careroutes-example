import { userConstants } from '../constants';

export const setSearchField = (search) => ({
  type: userConstants.SET_SEARCH,
  payload: { search }
});
