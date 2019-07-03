import axios from 'axios';
import setAuthToken from './../helpers/setAuthToken';

import { userConstants } from '../constants';
import { userService } from '../services';
import { history } from '../helpers';
import { alertActions } from './alert';

import { authHeader } from './../helpers';

export const userActions = {
  login,
  logout,
  resetPassword,
  setPasswords,
  getAccess
};

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const signin = (user) => dispatch => {
  axios.post(`${ROOT_URL}/auth/signin`, user)
    .then(response => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      dispatch(setCurrentUser(token));
      history.push('/');
    })
    .catch(error => {
      dispatch(authError(error.message));
    });
};

export const logOutUser = () => dispatch => {
  localStorage.removeItem('token');
  // setAuthToken(false);
  // dispatch(setCurrentUser({}));
  history.push('/login');
}

export const logOutUserFirstAccess = () => dispatch => {
  localStorage.removeItem('token')
}

export const checkAccessToken = (token) => dispatch => {
  dispatch({ type: userConstants.GET_ACCESS_REQUEST })
  axios.get(`${ROOT_URL}/auth/check-accesstoken/${token}`)
    .then(response => {
      const user = response.data;
      dispatch(setUser(user));
    })
    .catch(error => {
      dispatch(setPasswordError(error.response.data.message + ' Please contact your administrator.'));
      dispatch(logOutUser());
    });
}

export const setPassword = (model) => dispatch => {
  dispatch({ type: userConstants.GET_ACCESS_REQUEST })
  axios.post(`${ROOT_URL}/auth/set-password/`, model)
    .then(response => {
      const token = response.data.token;
      localStorage.setItem('token', token);
      dispatch(setPasswordSuccess('Set password successful'));
      history.push('/');
    })
    .catch(error => {
      dispatch(setPasswordError(error.message));
      dispatch(logOutUser());
    });
}

/** functional methods **/
export const setPasswordError = message => {
  return {
    type: userConstants.SET_PASSWORD_FAILURE,
    payload: { message }
  }
}

export const setPasswordSuccess = message => {
  return {
    type: userConstants.SET_PASSWORD_SUCCESS,
    payload: { message }
  }
}

export const setUser = user => {
  return {
    type: userConstants.SET_USER,
    payload: user
  }
}

export const setUserError = (error) => {
	return {
		type: userConstants.GET_ACCESS_FAILURE,
		payload: error
	};
}

export const setCurrentUser = token => {
  return {
    type: userConstants.AUTH_USER,
    payload: token
  }
};

export const authError = (error) => {
	return {
		type: userConstants.AUTH_ERROR,
		payload: error
	};
}

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    userService.login(email, password)
      .then(
        user => {
          dispatch(success(user));
          history.push('/');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function resetPassword(email) {
  return dispatch => {
    dispatch(request());

    userService.resetPassword(email)
      .then(
        request => {
          dispatch(success());
          history.push('/login');
          dispatch(alertActions.success('Reset Password successful'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: userConstants.PASSWORD_REQUEST } }
  function success() { return { type: userConstants.PASSWORD_SUCCESS } }
  function failure(error) { return { type: userConstants.PASSWORD_FAILURE, error } }
}

function setPasswords(password, accessToken) {
  return dispatch => {
    dispatch(request());

    userService.setPassword(password, accessToken)
      .then(
        token => {
          dispatch(success(token))
          history.push('/');
          dispatch(alertActions.success('Set Password successful'));
        },
        error => dispatch(failure(error))
      );
  };

  function request() { return { type: userConstants.SET_PASSWORD_REQUEST } }
  function success(token) { return { type: userConstants.SET_PASSWORD_SUCCESS, token } }
  function failure(error) { return { type: userConstants.SET_PASSWORD_FAILURE, error } }
}

export const setNewPassword = (token) => async dispatch => {
  try {
    const requestOptions = {
      headers: authHeader(token)
    };

    const response = await axios.get(`${ROOT_URL}/auth/check-accesstoken/${token}`, requestOptions);

    if(response.data) {
      dispatch({ type: userConstants.GET_ACCESS_REQUEST });

      history.push('/password');
    }
  } catch(e) {
    history.push('/bad');
  }
}

function getAccess(token) {
  return dispatch => {
    dispatch(request());

    userService.getAccess(token)
      .then(
        user => {
          dispatch(success(user));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
          history.push('/bad');
        }
    );
  };

  function request() { return { type: userConstants.GET_ACCESS_REQUEST } }
  function success(user) { return { type: userConstants.GET_ACCESS_SUCCESS, user } }
  function failure(error) { return { type: userConstants.GET_ACCESS_FAILURE, error } }
}