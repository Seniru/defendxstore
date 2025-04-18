import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import LoginForm from "../../forms/LoginForm"
import "./Login.css"

export default function Login() {
  return (
    <div className="content">
      <Link to="/">
        <FontAwesomeIcon icon={faChevronLeft} size="xs" /> Go back to home page
      </Link>
      <LoginForm className="login-page-login-form" />
    </div>
  )
}
