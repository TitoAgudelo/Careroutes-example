import * as jwtDecode from 'jwt-decode';

function loggedIn() {
  const token = getToken(); // Getting token from localstorage
  const isLogged = !!token && !isTokenExpired(token);
  return isLogged;
}

function getToken() {
  return localStorage.getItem('token')
}

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);

    if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
      return true;
    } else {
      localStorage.setItem('username', decoded.name);
      return false;
    }
  }
  catch (err) {
    return false;
  }
}

export default loggedIn;