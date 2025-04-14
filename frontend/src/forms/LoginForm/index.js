import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAt, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

import Button from "../../components/Button"
import Input from "../../components/Input"

import "./LoginForm.css"
import { useAuth } from "../../contexts/AuthProvider"

export default function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { loginAction } = useAuth()

  const emailRef = useRef()
  const [emailError, setEmailError] = useState(null)
  const passwordRef = useRef()
  const [passwordError, setPasswordError] = useState(null)

  const handleLogin = async (evt) => {
    evt.preventDefault()

    const isEmailValid = emailRef.current.validity.valid
    const isPasswordValid = passwordRef.current.validity.valid

    setEmailError(isEmailValid ? null : emailRef.current.validationMessage)
    setPasswordError(
      isPasswordValid ? null : passwordRef.current.validationMessage,
    )

    if (!isEmailValid || !isPasswordValid) return

    const response = await loginAction({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })
    if (response) {
      switch (response.field) {
        case "email":
          setEmailError(response.message)
          break
        case "password":
          setPasswordError(response.message)
          break
        default:
          break
      }
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className={`login-form container ${className}`}
      noValidate
    >
      <div className="login-form-inputs">
        <h1>Login</h1>
        <div>
          <label>
            <FontAwesomeIcon icon={faAt} /> Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            error={emailError}
            width={300}
            ref={emailRef}
            required
          />
        </div>
        <div>
          <label>
            <FontAwesomeIcon icon={faEyeSlash} /> Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            error={passwordError}
            ref={passwordRef}
            required
          />
        </div>
        <div className="login-form-actions">
          <Button kind="primary" type="submit">
            Login
          </Button>
          <Button
            kind="secondary"
            type="button"
            onClick={() => navigate("/auth/signup")}
          >
            Create an account
          </Button>
        </div>
      </div>
      <img src="/images/login-banner.jpg" alt="login-banner" />
    </form>
  )
}
