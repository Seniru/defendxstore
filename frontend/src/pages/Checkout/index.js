import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../../components/Button"
import Input from "../../components/Input"
import "./Checkout.css"
import { faShirt, faTruck } from "@fortawesome/free-solid-svg-icons"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"
import Table from "../../components/Table"

export default function Checkout() {
  return (
    <div className="content shopping-container">
      <div className="container">
        <h2>Delivery Information</h2>
        <form action="" className="ShoppingInfo">
          <div className="ShoppingInfo">
            <label htmlFor="fname">Full name:</label>
            <Input type="text" id="fname" name="fname" required />

            <br />
            <label htmlFor="Cname">City:</label>

            <Input type="text" id="Cname" name="Cname" />

            <label htmlFor="Pname">street address:</label>
            <Input type="text" id="lname" name="lname" required />

            <div className="checkout-row">
              <label htmlFor="State">State/province</label>
            </div>
            <Input type="text" id="Sname" name="Sname" required />

            <label htmlFor="Cname">Country:</label>

            <Input type="text" id="county" name="county" required />

            <br />
            <br />

            <Button type="submit" value="Submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
      <div className="container">
        <div className="product-info">
          <h2> Order Summary </h2>
          <div className="shopping-row">
            <img
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
              }}
              src={pic1}
            />
            <div>
              <b>Oversized Black rose</b>
              <div className="secondary-text">Qty:2</div>
            </div>

            <span>RS 3900</span>
          </div>
          <div className="shopping-row">
            <img
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
              }}
              src={pic2}
            />
            <div>
              <b>Oversized Black rose</b>
              <div className="secondary-text">Qty:2</div>
            </div>
            <span>RS 3900</span>
          </div>
          <div className="checkout-row">
            <h5>
              <FontAwesomeIcon icon={faTruck} /> Shipping
            </h5>
            <span>RS 200</span>
          </div>
          <hr />
          <div className="checkout-row">
            <h5>Subtotal</h5>
            <span>RS 8000</span>
          </div>
        </div>
        <hr />
        <div className="checkout-row">
          <h5>Promo Code</h5>
          <span>
            <Input type="text" id="Proname" name="Proname" maxlength="4" />
          </span>
        </div>
        <div className="checkout-row">
          <h5>Saved</h5>
          <span>20%</span>
        </div>

        <div className="checkout-row">
          <h2>Total</h2>
          <span>RS 7800</span>
        </div>
      </div>
    </div>
  )
}
