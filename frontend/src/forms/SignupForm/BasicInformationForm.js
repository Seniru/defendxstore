import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAt,
  faCircleInfo,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

import Input from "../../components/Input"
import Button from "../../components/Button"
import { usePagination } from "../../contexts/PaginationProvider"

export default function BasicInformationForm({
  data,
  setData,
  errors,
  setErrors,
}) {
  const navigate = useNavigate()
  const { gotoNextPage } = usePagination()

  const usernameRef = useRef()
  const [usernameError, setUsernameError] = useState(null)

  const emailRef = useRef()
  const [emailError, setEmailError] = useState(null)

  const passwordRef = useRef()
  const [passwordError, setPasswordError] = useState(null)

  const confPasswordRef = useRef()
  const [confPasswordError, setConfPasswordError] = useState(null)

  const handleSubmit = (evt) => {
    evt.preventDefault()

    const isUsernameValid = usernameRef.current.validity.valid
    const isEmailValid = emailRef.current.validity.valid
    const isPasswordValid = passwordRef.current.validity.valid
    const isConfPasswordValid = confPasswordRef.current.validity.valid

    setUsernameError(
      isUsernameValid ? null : usernameRef.current.validationMessage,
    )
    setEmailError(isEmailValid ? null : emailRef.current.validationMessage)
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

    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfPasswordValid
    ) {
      setData({
        ...data,
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confPassword: confPasswordRef.current.value,
      })
      gotoNextPage()
    }
  }

  useEffect(() => {
    if (!errors?.field) return
    ;({
      username: setUsernameError,
      email: setEmailError,
      password: setPasswordError,
    })[errors.field](errors.message)
  }, [errors])

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="signup-form-inputs">
        <div className="heading">
          <h3>Basic information</h3>
          <p className="secondary-text">
            <FontAwesomeIcon icon={faCircleInfo} /> We need these information to
            setup your account.
          </p>
          <hr />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faUser} /> User name
          </label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your name"
            ref={usernameRef}
            error={usernameError}
            defaultValue={data.username}
            required
          />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faAt} /> Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            ref={emailRef}
            error={emailError}
            defaultValue={data.email}
            required
          />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faEyeSlash} /> Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            ref={passwordRef}
            error={passwordError}
            defaultValue={data.password}
            required
          />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faEyeSlash} /> Password confirmation
          </label>
          <Input
            type="password"
            name="password-conf"
            placeholder="Re-enter your password"
            ref={confPasswordRef}
            error={confPasswordError}
            defaultValue={data.confPassword}
            required
          />
        </div>
        <div className="inputs signup-form-actions">
          <Button kind="primary" type="submit">
            Continue
          </Button>
          <Button
            kind="secondary"
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            Already have an account? Login instead
          </Button>
        </div>
      </div>
      <img src="/images/signup-banner-1.jpg" alt="signup-banner" />
    </form>
  )
}
