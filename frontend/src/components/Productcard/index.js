import React from "react"
import "./Productcard.css"
import Button from "../Button"
import item1 from "../../assets/images/item1.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-regular-svg-icons"

const Productcard = () => {
  return (
    <div className="product-card">
      <div className="product-photo">
        <img src={item1} alt="product" />
      </div>
      <div className="product-data">
        <h3 className="product-title">Over-SIZED Tee</h3>
        <div className="product-meta">
          <p className="price">LKR 3,200.00</p>
          <p className="category">T Shirt</p>
        </div>
        <div className="action-btns">
          <Button kind="primary">Buy Now</Button>
          <FontAwesomeIcon
            style={{
              color: "black",
              cursor: "pointer",
              fontSize: "25px",
              hover: "color",
            }}
            icon={faHeart}
          />
        </div>
      </div>
    </div>
  )
}

export default Productcard
