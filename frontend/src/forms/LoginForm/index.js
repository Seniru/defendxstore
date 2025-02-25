import { useRef } from "react"
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
  const passwordRef = useRef()

  const handleLogin = (evt) => {
    evt.preventDefault()
    loginAction({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })
  }

  return (
    <form
      onSubmit={handleLogin}
      className={`login-form container ${className}`}
    >
      <div className="login-form-inputs">
        <h1>Login</h1>
        <div>
          <label>
            <FontAwesomeIcon icon={faAt} /> Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
