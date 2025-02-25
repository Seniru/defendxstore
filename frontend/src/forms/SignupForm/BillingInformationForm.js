import { useNavigate } from "react-router-dom"

import Button from "../../components/Button"
import Input from "../../components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleInfo,
  faHouse,
  faLocation,
  faMap,
  faMapSigns,
  faPhone,
  faRoad,
} from "@fortawesome/free-solid-svg-icons"
import Select from "../../components/Select"
import { usePagination } from "../../contexts/PaginationProvider"

export default function BillingInformationForm() {
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
          <h3>Billing information</h3>
          <p className="secondary-text">
            <FontAwesomeIcon icon={faCircleInfo} /> Fill these information to
            set up your billing information. You can skip this step and edit
            these details later.
          </p>
          <hr />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faMap} /> District
          </label>
          <Select
            items={[
              "Colombo",
              "Gampaha",
              "Kaluthara",
              "Nuwara Eliya",
              "Kandy",
              "Mathale",
              "Jaffna",
              "Galle",
              "Hambanthota",
            ]}
          />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faMapSigns} /> City
          </label>
          <Input type="text" placeholder="Enter your city" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faLocation} /> Postal Code
          </label>
          <Input type="text" placeholder="Enter your postal code" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faRoad} /> Street
          </label>
          <Input type="text" placeholder="Enter your street" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faHouse} /> House Number
          </label>
          <Input type="text" placeholder="Enter your house number" />
        </div>
        <div className="inputs">
          <label>
            <FontAwesomeIcon icon={faPhone} /> Contact number
          </label>
          <Input type="text" placeholder="Enter your contact number" />
        </div>

        <div className="inputs signup-form-actions">
          <div className="signup-form-actions-primary">
            <Button kind="primary" type="submit">
              Continue
            </Button>
            <Button kind="secondary" type="submit">
              Skip
            </Button>
          </div>
          <Button
            kind="secondary"
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            Already have an account? Login instead
          </Button>
        </div>
      </div>
      <img src="/images/signup-banner-2.jpg" alt="signup banner" />
    </form>
  )
}
