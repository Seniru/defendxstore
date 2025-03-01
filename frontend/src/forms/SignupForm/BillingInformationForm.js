import { useState, useRef } from "react"
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
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons"
import Select from "../../components/Select"
import { usePagination } from "../../contexts/PaginationProvider"

export default function BillingInformationForm({
  data,
  setData,
  errors,
  setErrors,
}) {
  const navigate = useNavigate()
  const { gotoNextPage, gotoPreviousPage } = usePagination()

  const districtRef = useRef()

  const cityRef = useRef()
  const [cityError, setCityError] = useState(null)

  const postalCodeRef = useRef()
  const [postalCodeError, setPostalCodeError] = useState(null)

  const streetRef = useRef()
  const [streetError, setStreetError] = useState(null)

  const houseNoRef = useRef()
  const [houseNoError, setHouseNoError] = useState(null)

  const telRef = useRef()
  const [telError, setTelError] = useState(null)

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const isCityValid = cityRef.current.validity.valid
    const isPostalCodeValid = postalCodeRef.current.validity.valid
    const isStreetValid = streetRef.current.validity.valid
    const isHouseNoValid = houseNoRef.current.validity.valid
    const isTelValid = telRef.current.validity.valid

    setCityError(isCityValid ? null : cityRef.current.validationMessage)
    setPostalCodeError(
      isPostalCodeValid ? null : postalCodeRef.current.validationMessage,
    )
    setStreetError(isStreetValid ? null : streetRef.current.validationMessage)
    setHouseNoError(
      isHouseNoValid ? null : houseNoRef.current.validationMessage,
    )
    setTelError(isTelValid ? null : telRef.current.validationMessage)

    if (
      isCityValid &&
      isPostalCodeValid &&
      isStreetValid &&
      isHouseNoValid &&
      isTelValid
    ) {
      setData({
        ...data,
        district: districtRef.current.value,
        city: cityRef.current.value,
        postalCode: postalCodeRef.current.value,
        street: streetRef.current.value,
        houseNo: houseNoRef.current.value,
        tel: telRef.current.value,
      })
      gotoNextPage()
    }
  }

  return (
    <>
      <div className="signup-back secondary-text" onClick={gotoPreviousPage}>
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </div>
      <form onSubmit={handleSubmit} noValidate>
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
              ref={districtRef}
              defaultValue={data.district}
            />
          </div>
          <div className="inputs">
            <label>
              <FontAwesomeIcon icon={faMapSigns} /> City
            </label>
            <Input
              type="text"
              placeholder="Enter your city"
              ref={cityRef}
              error={cityError}
              defaultValue={data.city}
              required
            />
          </div>
          <div className="inputs">
            <label>
              <FontAwesomeIcon icon={faLocation} /> Postal Code
            </label>
            <Input
              type="text"
              placeholder="Enter your postal code"
              ref={postalCodeRef}
              error={postalCodeError}
              defaultValue={data.postalCode}
              required
            />
          </div>
          <div className="inputs">
            <label>
              <FontAwesomeIcon icon={faRoad} /> Street
            </label>
            <Input
              type="text"
              placeholder="Enter your street"
              ref={streetRef}
              error={streetError}
              defaultValue={data.street}
              required
            />
          </div>
          <div className="inputs">
            <label>
              <FontAwesomeIcon icon={faHouse} /> House Number
            </label>
            <Input
              type="text"
              placeholder="Enter your house number"
              ref={houseNoRef}
              error={houseNoError}
              defaultValue={data.houseNo}
              required
            />
          </div>
          <div className="inputs">
            <label>
              <FontAwesomeIcon icon={faPhone} /> Contact number
            </label>
            <Input
              type="tel"
              placeholder="Enter your contact number"
              ref={telRef}
              error={telError}
              defaultValue={data.tel}
              required
            />
          </div>

          <div className="inputs signup-form-actions">
            <div className="signup-form-actions-primary">
              <Button kind="primary" type="submit">
                Continue
              </Button>
              <Button kind="secondary" type="button" onClick={gotoNextPage}>
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
    </>
  )
}
