export function authHeader(token) {
  // return authorization header with jwt token
  let tokenString = token || JSON.parse(localStorage.getItem('token')).token;

  if (tokenString) {
    return { 'Authorization': 'Bearer ' + tokenString };
  } else {
    return {};
  }
}