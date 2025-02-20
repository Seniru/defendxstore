const { getReasonPhrase } = require("http-status-codes")

module.exports = (response, statusCode, body) => {
    let success = statusCode >= 200 && statusCode < 300
    let statusMessage = getReasonPhrase(statusCode)
    return response.status(statusCode).json({ success, statusMessage, body })
}
