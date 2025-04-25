import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../../components/Button"
import Input from "../../components/Input"
import "./Checkout.css"
import { faInfoCircle, faTruck } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartProvider"
import { useAuth } from "../../contexts/AuthProvider"
import useFetch from "../../hooks/useFetch"
import api from "../../utils/api"
import { useEffect, useRef, useState } from "react"

const { REACT_APP_API_URL } = process.env

export default function Checkout() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { items, refreshCart, setRefreshCart } = useCart()
  const houseNoRef = useRef()
  const streetRef = useRef()
  const cityRef = useRef()
  const postalCodeRef = useRef()
  const promocodeRef = useRef()
  const [houseNoError, setHouseNoError] = useState(null)
  const [streetError, setStreetError] = useState(null)
  const [cityError, setCityError] = useState(null)
  const [postalCodeError, setPostalCodeError] = useState(null)
  const [promocodeError, setPromocodeError] = useState(null)
  const [profileData, _, profileDataLoading] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user.username}`,
    { body: {} },
  )

  useEffect(() => {
    const cart = items?.body?.cart
    if (cart?.length === 0) navigate("/")
  }, [items?.body?.cart, navigate])

  const total = (items?.body?.cart || []).reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    200,
  )

  let houseNo, street, city, postalCode
  let addressFragments = (profileData?.body?.user?.deliveryAddress || "").split(
    "\n",
  )
  if (addressFragments[0]) {
    let houseInfo = addressFragments[0].split(", ")
    houseNo = houseInfo[0]
    street = houseInfo[1]
  }
  if (addressFragments[1]) {
    let cityInfo = addressFragments[1].split(", ")
    postalCode = cityInfo[0]
    city = cityInfo[1]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isHouseNoValid = houseNoRef.current.validity.valid
    const isStreetValid = streetRef.current.validity.valid
    const isCityValid = cityRef.current.validity.valid
    const isPostalCodeValid = postalCodeRef.current.validity.valid
    const isPromocodeValid = promocodeRef.current.validity.valid

    setHouseNoError(
      isHouseNoValid ? null : houseNoRef.current.validationMessage,
    )
    setStreetError(isStreetValid ? null : streetRef.current.validationMessage)
    setCityError(isCityValid ? null : cityRef.current.validationMessage)
    setPostalCodeError(
      isPostalCodeValid ? null : postalCodeRef.current.validationMessage,
    )
    setPromocodeError(
      isPromocodeValid ? null : promocodeRef.current.validationMessage,
    )

    if (
      !isHouseNoValid ||
      !isStreetValid ||
      !isCityValid ||
      !isPostalCodeValid ||
      !isPromocodeValid
    )
      return

    const deliveryAddress = `${houseNoRef.current.value}, ${streetRef.current.value}\n${postalCodeRef.current.value}, ${cityRef.current.value}`

    let body = { deliveryAddress }
    if (promocodeRef.current.value) body.promocode = promocodeRef.current.value

    const response = await api.post("/api/orders", body, token)
    const result = await response.json()
    if (!response.ok) {
      if (result.body.field && result.body.field === "promocode")
        setPromocodeError(result.body.message)
    } else {
      setRefreshCart(!refreshCart)
      navigate(`/invoice?id=${result.body._id}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="content shopping-container"
      noValidate
    >
      <div className="container">
        <h2>Delivery Information</h2>

        <div className="ShoppingInfo">
          <div className="ShoppingInfo">
            <label htmlFor="fname">Full name:</label>
            <Input
              type="text"
              id="fname"
              name="fname"
              value={profileData?.body?.user?.username}
              required
            />

            <br />

            <label htmlFor="Cname">House number:</label>
            <Input
              type="text"
              id="houseNo"
              name="houseNo"
              value={houseNo}
              ref={houseNoRef}
              error={houseNoError}
              required
            />

            <label htmlFor="Sname">Street:</label>
            <Input
              type="text"
              id="Sname"
              name="Sname"
              value={street}
              ref={streetRef}
              error={streetError}
              required
            />

            <label htmlFor="Cname">City:</label>
            <Input
              type="text"
              id="Cname"
              name="Cname"
              value={city}
              ref={cityRef}
              error={cityError}
              required
            />

            <label htmlFor="Pcode">Postal code:</label>
            <Input
              type="text"
              id="Pcode"
              name="Pcode"
              value={postalCode}
              ref={postalCodeRef}
              error={postalCodeError}
              required
            />

            <br />
            <br />

            <Button type="submit" value="Submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="product-info">
          <h2> Order Summary </h2>
          {(items?.body?.cart || []).map((item) => (
            <div className="shopping-row">
              <div style={{ display: "flex" }}>
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                  src={item.product}
                />
                <div>
                  <b>{item.itemName}</b>
                  <div className="secondary-text">Qty: {item.quantity}</div>
                </div>
              </div>

              <span>LKR {item.price * item.quantity}</span>
            </div>
          ))}

          <div className="checkout-row">
            <h5>
              <FontAwesomeIcon icon={faTruck} /> Shipping
            </h5>
            <span>LKR 200</span>
          </div>
          <hr />
        </div>
        <div className="checkout-row">
          <h5>Promo Code</h5>
          <span>
            <Input
              type="text"
              id="Proname"
              name="Proname"
              minLength="2"
              ref={promocodeRef}
              error={promocodeError}
            />
          </span>
        </div>
        <span className="secondary-text">
          <FontAwesomeIcon icon={faInfoCircle} /> Discount will be applied at
          checkout
        </span>

        <div className="checkout-row">
          <h2>Total</h2>
          <span>LKR {total}</span>
        </div>
      </div>
    </form>
  )
}
