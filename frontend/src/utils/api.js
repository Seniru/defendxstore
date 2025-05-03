const { REACT_APP_API_URL } = process.env

const request = async (route, method, data, token, isMultipart = false) => {
  let headers = {}

  if (token) headers["Authorization"] = "Bearer " + token

  // Only set Content-Type if not multipart
  if (!isMultipart) {
    headers["Content-Type"] = "application/json"
  }

  const body = isMultipart ? data : JSON.stringify(data)

  const response = await fetch(`${REACT_APP_API_URL}${route}`, {
    method,
    headers,
    body,
  })
  return response
}

// seniru
const get = async (route, data, token) =>
  await request(route, "GET", data, token)
const post = async (route, data, token, isMultipart = false) =>
  await request(route, "POST", data, token, isMultipart)
const put = async (route, data, token, isMultipart = false) =>
  await request(route, "PUT", data, token, isMultipart)
const patch = async (route, data, token) =>
  await request(route, "PATCH", data, token)
const delete_ = async (route, data, token) =>
  await request(route, "DELETE", data, token)

const api = { request, get, post, put, patch, delete: delete_ }

export default api
