import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import "./MessageBox.css"

function MessageComponent({ type, message, setMessage, position = "top" }) {
  useEffect(() => {
    if (message) {
      let timeout = setTimeout(() => {
        setMessage(null)
      }, 3000)
      // clear the timeout when unmouting
      return () => clearTimeout(timeout)
    }
  }, [message, setMessage])

  const getBoxClass = () => {
    switch (type) {
      case "error":
        return "error-box"
      case "warning":
        return "warning-box"
      case "success":
        return "success-box"
      case "info":
      default:
        return "info-box"
    }
  }

  const getPositionClass = () => {
    switch (position) {
      case "middle":
        return "middle-position"
      case "bottom":
        return "bottom-position"
      case "top":
      default:
        return "top-position"
    }
  }

  return (
    <div className={`message-box ${getBoxClass()} ${getPositionClass()}`}>
      <div
        className="message-box-close-button"
        onClick={() => {
          setMessage(null)
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </div>
      {message}
    </div>
  )
}

export default function MessageBox({
  isError,
  type,
  message,
  setMessage,
  position,
}) {
  const messageType = isError ? "error" : type || "success"

  return (
    message && (
      <MessageComponent
        type={messageType}
        message={message}
        setMessage={setMessage}
        position={position}
      />
    )
  )
}
