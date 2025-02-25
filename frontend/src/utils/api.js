const { REACT_APP_API_URL } = process.env

const request = async (route, method, data, token) => {
  let headers = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = "Bearer " + token
  let response = await fetch(`${REACT_APP_API_URL}${route}`, {
    method,
    headers,
    body: JSON.stringify(data),
  })
  return response
}

const get = async (route, data, token) =>
  await request(route, "GET", data, token)
const post = async (route, data, token) =>
  await request(route, "POST", data, token)
const put = async (route, data, token) =>
  await request(route, "PUT", data, token)
const patch = async (route, data, token) =>
  await request(route, "PATCH", data, token)
const delete_ = async (route, data, token) =>
  await request(route, "DELETE", data, token)

const api = { request, get, post, put, patch, delete: delete_ }

export default api
