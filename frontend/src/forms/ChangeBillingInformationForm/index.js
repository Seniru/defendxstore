import {
  faHouse,
  faLocation,
  faMapSigns,
  faPhone,
  faRoad,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef, useState } from "react"
import Input from "../../components/Input"

import "./ChangeBillingInformationForm.css"
import Button from "../../components/Button"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"

export default function ChangeBillingInformationForm({
  setIsError,
  setMessage,
  setIsOpen,
}) {
  const { user, token } = useAuth()
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

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const isCityValid = cityRef.current.validity.valid
    const isPostalCodeValid = postalCodeRef.current.validity.valid
    const isStreetValid = streetRef.current.validity.valid
    const isHouseNoValid = houseNoRef.current.validity.valid
    const isTelValid = telRef.current.validity.valid

    const cityVal = cityRef.current.value.trim()
    const postalCodeVal = postalCodeRef.current.value.trim()
    const streetVal = streetRef.current.value.trim()
    const houseNoVal = houseNoRef.current.value.trim()
    const telVal = telRef.current.value.trim()

    setCityError(isCityValid ? null : cityRef.current.validationMessage)
    setPostalCodeError(
      isPostalCodeValid ? null : postalCodeRef.current.validationMessage,
    )
    setStreetError(isStreetValid ? null : streetRef.current.validationMessage)
    setHouseNoError(
      isHouseNoValid ? null : houseNoRef.current.validationMessage,
    )
    setTelError(isTelValid ? null : telRef.current.validationMessage)

    const body = {}
    if (cityVal || postalCodeVal || streetVal || houseNoVal) {
      if (cityVal === "") return setCityError("City can't be blank")
      if (postalCodeVal === "")
        return setPostalCodeError("Postal code can't be blank")
      if (streetVal === "") return setStreetError("Street can't be blank")
      if (houseNoVal === "")
        return setHouseNoError("House number can't be blank")
      body.deliveryAddress = `${houseNoVal}, ${streetVal}\n${postalCodeVal}, ${cityVal}`
    }
    if (telVal) body.contactNumber = telVal

    const response = await api.patch(
      `/api/users/${user.username}/profile`,
      body,
      token,
    )
    const result = await response.json()
    if (response.ok) return window.location.reload()
    setIsError(true)
    setMessage(result.body)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="change-billing-info-form"
      noValidate
    >
      <h3>Edit Billing information</h3>
      <label>
        <FontAwesomeIcon icon={faMapSigns} /> City
      </label>
      <Input
        type="text"
        placeholder="Enter your city"
        ref={cityRef}
        error={cityError}
        width={400}
      />
      <label>
        <FontAwesomeIcon icon={faLocation} /> Postal Code
      </label>
      <Input
        type="text"
        placeholder="Enter your postal code"
        ref={postalCodeRef}
        error={postalCodeError}
        width={400}
      />
      <label>
        <FontAwesomeIcon icon={faRoad} /> Street
      </label>
      <Input
        type="text"
        placeholder="Enter your street"
        ref={streetRef}
        error={streetError}
        width={400}
      />
      <label>
        <FontAwesomeIcon icon={faHouse} /> House Number
      </label>
      <Input
        type="text"
        placeholder="Enter your house number"
        ref={houseNoRef}
        error={houseNoError}
        width={400}
      />
      <div>
        <hr />
      </div>
      <label>
        <FontAwesomeIcon icon={faPhone} /> Contact number
      </label>
      <Input
        type="tel"
        placeholder="Enter your contact number"
        ref={telRef}
        error={telError}
        width={400}
      />
      <Button kind="primary">Submit</Button>
    </form>
  )
}
