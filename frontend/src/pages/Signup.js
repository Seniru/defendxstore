import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import SignupForm from "../forms/SignupForm"
import "./styles/Signup.css"

export default function Signup() {
  return (
    <div className="content">
      <Link to="/">
        <FontAwesomeIcon icon={faChevronLeft} size="xs" /> Go back to home page
      </Link>
      <SignupForm className="signup-page-signup-form" />
    </div>
  )
}
