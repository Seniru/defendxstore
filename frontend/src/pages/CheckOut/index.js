import Table from "../../components/Table"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"

import "./Checkout.css"
import Button from "../../components/Button"
import {
  faCartShopping,
  faShirt,
  faTruck,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function CheckOut() {
  return (
    <div className="content">
      <h1>
        <FontAwesomeIcon icon={faCartShopping} />
        Shopping Cart
      </h1>
      <div className="checkOut">
        <Table
          headers={["", "Product ", "Color ", "price", "quantity", "Subtotal"]}
          rows={[
            [
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                }}
                src={pic1}
              />,
              "Oversized Black",
              "Black",
              "3900",
              "2",
              "7800",
            ],

            [
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                }}
                src={pic2}
              />,
              "Oversized White",
              "White",
              "3500",
              "1",
              "3500",
            ],
            [
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                }}
                src={pic3}
              />,
              "Oversized Black rose",
              "Black",
              "3900",
              "1",
              "3900",
            ],
            [
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                }}
                src={pic4}
              />,
              "Oversized maroon rose",
              "maroon",
              "4000",
              "2",
              "8000",
            ],
          ]}
        />
        <div className="container order-container">
          <h2> Order Summary </h2>
          <div className="checkout-row">
            <h5>
              <FontAwesomeIcon icon={faShirt} /> Items(2){" "}
            </h5>

            <span>RS 3900</span>
          </div>
          <div className="checkout-row">
            <h5>
              <FontAwesomeIcon icon={faTruckFast} /> Shipping
            </h5>
            <span>RS 200</span>
          </div>
          <hr />
          <div className="checkout-row">
            <h2>Total</h2>
            <span>RS 7800</span>
          </div>
          <div className="checkOutButton">
            <Button kind="primary" className={"CheckOutButton"}>
              {" "}
              Proceed to CheckOut
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
