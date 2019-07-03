import { authHeader } from './../helpers';
import { API_ROOT } from './../api-config';

export const userService = {
  login,
  logout,
  resetPassword,
  setPassword,
  getAccess
};

function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  };

  return fetch(`${API_ROOT}/auth/signin`, requestOptions)
    .then(handleResponse)
    .then(token => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('token', token);

      return token;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
}

function resetPassword(email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  };

  return fetch(`${API_ROOT}/auth/reset-password`, requestOptions).then(handleResponse);
}

function setPassword(password, accessToken) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(accessToken),
    body: JSON.stringify({ password, accessToken })
  };

  return fetch(`${API_ROOT}/auth/set-password`, requestOptions).then(handleResponse);
}

function getAccess(token) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(token)
  };

  return fetch(`${API_ROOT}/auth/check-accesstoken/${token}`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', user);

      return user;
    });
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        // location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
