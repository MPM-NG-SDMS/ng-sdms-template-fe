export function isLoggedIn() {
  return sessionStorage.getItem('token') !== null
}

export function logout() {
  sessionStorage.removeItem('token')
}

export function getUserInfo() {
  return {}

  // const token = sessionStorage.getItem('token')
  // if (!token || token === 'null') {
  //   sessionStorage.removeItem('token')
  //   return null
  // }
  // const decoded = jwtDecode(token)
  // return decoded
}

export function getUsername() {
  const username = sessionStorage.getItem('username')
  return username
}

export function getToken() {
  const token = sessionStorage.getItem('token')
  return token
}

export function getIdInternal() {
  const idinternal = sessionStorage.getItem('idinternal')
  return idinternal
}
