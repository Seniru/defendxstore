import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import Table from "../../components/Table"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"

import "./Profile.css"
import Select from "../../components/Select"

function Order({}) {
  return (
    <div className="Order-container container">
      <div className="Order-stars">
        <div className="Order-profile">
          <img
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
            src={pic1}
          />
        </div>
      </div>

      <div className="Order-content">
        Order Number: #123456789
        <br />
        Date: March 24 2025
        <br />
        Customer:jonny perera 202, Malabe, Srilank
      </div>

      <div className="Status">PENDING</div>
    </div>
  )
}

export default function OrderMenu() {
  return (
    <div className="content">
      <div>
        Orders/Deliveries status
        <Select items={["All", "Pending", "Done", "shipping"]} />
      </div>
      <Order />
      <Order />
      <Order />
    </div>
  )
}
