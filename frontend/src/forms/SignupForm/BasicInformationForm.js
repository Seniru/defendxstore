import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAt,
  faCircleInfo,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

import Input from "../../components/Input"
import Button from "../../components/Button"
import { useNavigate } from "react-router-dom"
import { usePagination } from "../../contexts/PaginationProvider"

export default function BasicInformationForm() {
  const navigate = useNavigate()
  const { gotoNextPage } = usePagination()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    gotoNextPage()
  }

  return (
    <form onSubmit={handleSubmit}>
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
          <Input type="text" placeholder="Enter your name" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faAt} /> Email
          </label>
          <Input type="email" placeholder="Enter your email" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faEyeSlash} /> Password
          </label>
          <Input type="password" placeholder="Enter your password" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faEyeSlash} /> Password confirmation
          </label>
          <Input type="password" placeholder="Re-enter your password" />
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
