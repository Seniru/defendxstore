import Table from "../../components/Table"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"

import "./Cart.css"
import Button from "../../components/Button"
import {
  faCartShopping,
  faShirt,
  faTruck,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
import { useAuth } from "../../contexts/AuthProvider"
import { useEffect, useState } from "react"

const { REACT_APP_API_URL } = process.env

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user?.username}/cart`,
    { body: [] },
  )
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (items?.body == 0) return
    setTotal(
      items?.body
        ?.map((item) => Number(item.product.price))
        .reduce((total, value) => total + value),
    )
  }, [items])

  if (!user) {
    return navigate("login")
  }

  return (
    <div className="content">
      <h1>
        <FontAwesomeIcon icon={faCartShopping} />
        My Cart
      </h1>

      <div className="checkOut">
        <Table
          headers={["", "Product ", "Color ", "Price", "Quantity", "Subtotal"]}
          rows={items?.body?.map((item) => [
            <img
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
              }}
              src={item.product.product}
            />,
            item.product.itemName,
            <div
              className="color-square"
              style={{ backgroundColor: item.color }}
            ></div>,
            item.product.price,
            1,
            item.product.price,
          ])}
        />
        <div className="container order-container">
          <h2> Order Summary </h2>
          <div className="checkout-row">
            <b>
              <FontAwesomeIcon icon={faShirt} /> Items ({items?.body?.length}){" "}
            </b>
            <span>RS {total}</span>
          </div>
          <br />
          <div className="checkout-row">
            <b>
              <FontAwesomeIcon icon={faTruckFast} /> Shipping
            </b>
            <span>RS 200</span>
          </div>
          <br />
          <hr />
          <div className="checkout-row">
            <h2>Total</h2>
            <span>RS {total + 200}</span>
          </div>
          <div className="checkOutButton">
            <Link to="/checkout">
              <Button kind="primary" className={"CheckOutButton"}>
                {" "}
                Proceed to CheckOut
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
