import { useState } from "react"
import { useAuth } from "../../contexts/AuthProvider"
import ChangePasswordForm from "../../forms/ChangePasswordForm"
import Forbidden from "../errors/Forbidden"

import "./ResetPassword.css"
import { Link, useSearchParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import Button from "../../components/Button"

export default function ResetPassword() {
  const { user } = useAuth()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [urlSearchParams] = useSearchParams()
  const username = urlSearchParams.get("username")
  const resetToken = urlSearchParams.get("token")

  if (user) return <Forbidden />

  return (
    <>
      <div className="reset-password content container">
        {!isError && message !== null ? (
          <>
            <div>
              <h3>Successful</h3>
              <hr />
              <br />
            </div>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} /> Your password has been
              reset. Please log in to continue.
              <br />
              <br />
            </div>
            <Link to="/auth/login" style={{ display: "grid" }}>
              <Button kind="primary">Login</Button>
            </Link>
          </>
        ) : (
          <ChangePasswordForm
            setIsError={setIsError}
            setMessage={setMessage}
            resetToken={resetToken}
            resetUsername={username}
          />
        )}
      </div>
    </>
  )
}
