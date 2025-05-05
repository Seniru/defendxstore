import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Input from "../../components/Input"
import {
  faCheckCircle,
  faEnvelope,
  faInfoCircle,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"
import Button from "../../components/Button"
import { useRef, useState } from "react"
import api from "../../utils/api"

import "./ForgotPasswordForm.css"

export default function ForgotPasswordForm() {
  const emailRef = useRef()
  const [emailError, setEmailError] = useState(null)
  const [actionDone, setActionDone] = useState(false)

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (actionDone) return

    const isEmailValid = emailRef.current.validity.valid
    setEmailError(isEmailValid ? null : emailRef.current.validationMessage)
    if (!isEmailValid) return

    await api.post("/api/auth/forgot-password", {
      email: emailRef.current.value,
    })
    setActionDone(true)
  }

  return (
    <form
      className="container forgot-password-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <h3>Reset password</h3>
        <hr />
      </div>
      <p>
        <FontAwesomeIcon icon={faInfoCircle} /> Please enter the verified email
        address linked to your account. A password reset link will be sent to
        your inbox.
        <br />
        If your email is not verified, please complete verification first.
      </p>
      <p>
        <FontAwesomeIcon icon={faPhone} /> Contact support for further
        assistance.
        <br />
        <br />
      </p>

      <Input
        type="email"
        placeholder="Enter your email address"
        error={emailError}
        ref={emailRef}
        required
      />

      <Button type="submit" kind="primary" disabled={actionDone}>
        {actionDone ? (
          <>
            <FontAwesomeIcon icon={faCheckCircle} /> A reset link has been sent
            to the verified email address
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faEnvelope} /> Send password reset email
          </>
        )}
      </Button>
    </form>
  )
}
