import React, { useEffect, useRef, useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import "./Product.css"
import product1 from "../../assets/images/item2.jpg"
import Select from "../../components/Select"
import Input from "../../components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faTag } from "@fortawesome/free-solid-svg-icons"
import useFetch from "../../hooks/useFetch"
import NotFound from "../errors/NotFound"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import Button from "../../components/Button"
import MessageBox from "../../components/MessageBox"
import OverlayWindow from "../../components/OverlayWindow"
import LoginForm from "../../forms/LoginForm"

const { REACT_APP_API_URL } = process.env

const Product = () => {
  const sizesSelectorRef = useRef()
  const quantityRef = useRef()
  const [quantityError, setQuantityError] = useState(null)
  const [color, setColor] = useState("black")
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false)

  const { user, token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get("id")
  const [item, itemError, itemLoading] = useFetch(
    `${REACT_APP_API_URL}/api/items/${searchParams.get("id")}`,
    null,
  )

  const addItemToCart = async (evt) => {
    evt.preventDefault()
    if (!user) return setIsLoginFormOpen(true)
    const size = sizesSelectorRef.current.value
    const quantity = quantityRef.current.value

    const isQuantityValid = quantityRef.current.validity.valid

    setQuantityError(
      isQuantityValid ? null : quantityRef.current.validationMessage,
    )

    if (!isQuantityValid) return

    const response = await api.post(
      `/api/users/${user.username}/cart`,
      {
        productId: id,
        color,
        size,
        quantity,
      },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
  }

  useEffect(() => {
    setColor(item?.body?.colors[0])
  }, [item])

  if (!itemLoading && (id === null || item == null)) return <NotFound />

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <OverlayWindow isOpen={isLoginFormOpen} setIsOpen={setIsLoginFormOpen}>
        <LoginForm className="no-image" style={{ width: "min-content" }} />
      </OverlayWindow>
      <form className="product-checkout" noValidate>
        <div className="product-image-container">
          <img
            src={item?.body?.product}
            alt="Product"
            className="product-image"
          />
        </div>

        <div className="product-details">
          <h2>{item?.body?.itemName}</h2>
          <p>{item?.body?.description}</p>
          <div className="price">
            <FontAwesomeIcon icon={faTag} /> LKR {item?.body?.price}
          </div>

          <div className="colors">
            <h3>Colors</h3>
            <div className="color-options">
              {item?.body?.colors.map((color, index) => (
                <input
                  type="radio"
                  name="color"
                  value={color}
                  key={index}
                  className="color-square"
                  onChange={() => setColor(color)}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="sizes">
            <h3>Sizes</h3>
            <div className="size-and-guide">
              <Select items={item?.body?.size || []} ref={sizesSelectorRef} />

              <a
                href="https://i.etsystatic.com/36489670/r/il/b0d388/4051942364/il_1588xN.4051942364_gfvj.jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>
                  Size Guide <FontAwesomeIcon icon={faCircleInfo} />
                </h4>
              </a>
            </div>
          </div>

          <div className="quantity">
            <h3>Quantity</h3>
            <Input
              type="number"
              initialValue={1}
              ref={quantityRef}
              error={quantityError}
              min={1}
              required
            />
          </div>

          <Button kind="primary" onClick={addItemToCart}>
            Add to Cart
          </Button>
        </div>
      </form>
    </>
  )
}

export default Product
