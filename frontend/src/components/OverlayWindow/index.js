import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./OverlayWindow.css"
import { faX } from "@fortawesome/free-solid-svg-icons"

export default function OverlayWindow({ isOpen, setIsOpen, children }) {
  const closeWindow = (evt) => {
    setIsOpen(false)
  }

  return (
    <div
      className="container overlay-window"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <FontAwesomeIcon
        icon={faX}
        color="red"
        onClick={closeWindow}
        cursor="pointer"
        className="overlay-window-close-button"
      />
      {children}
    </div>
  )
}
