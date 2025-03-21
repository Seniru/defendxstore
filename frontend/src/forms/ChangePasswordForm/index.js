import { faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Input from "../../components/Input"
import Button from "../../components/Button"

import "./ChangePasswordForm.css"
import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthProvider"
import api from "../../utils/api"

export default function ChangePasswordForm({
  setIsOpen,
  setIsError,
  setMessage,
}) {
  const { user, token } = useAuth()

  const passwordRef = useRef()
  const [passwordError, setPasswordError] = useState(null)

  const confPasswordRef = useRef()
  const [confPasswordError, setConfPasswordError] = useState(null)

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const isPasswordValid = passwordRef.current.validity.valid
    const isConfPasswordValid = confPasswordRef.current.validity.valid

    setPasswordError(
      isPasswordValid ? null : passwordRef.current.validationMessage,
    )
    setConfPasswordError(
      isConfPasswordValid ? null : confPasswordRef.current.validationMessage,
    )

    if (passwordRef.current.value !== confPasswordRef.current.value)
      return setConfPasswordError(
        "Password and confirmation password should match",
      )

    if (isPasswordValid) {
      const response = await api.put(
        `/api/users/${user.username}/password`,
        { password: passwordRef.current.value },
        token,
      )
      const result = await response.json()
      setIsError(!response.ok)
      setMessage(result.body)
      setIsOpen(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="change-password-form" noValidate>
      <div>
        <h3>Change password</h3>
        <p className="secondary-text">
          <FontAwesomeIcon icon={faInfoCircle} /> Choose a new password for your
          account
        </p>
      </div>
      <label>
        <FontAwesomeIcon icon={faEyeSlash} /> Password
      </label>
      <Input
        type="password"
        name="password"
        placeholder="Enter your password"
        width={400}
        ref={passwordRef}
        error={passwordError}
        required
      />
      <label>
        <FontAwesomeIcon icon={faEyeSlash} /> Password confirmation
      </label>
      <Input
        type="password"
        name="password-conf"
        placeholder="Re-enter your password"
        width={400}
        ref={confPasswordRef}
        error={confPasswordError}
        required
      />
      <Button type="submit" kind="primary">
        Change my password
      </Button>
    </form>
  )
}
