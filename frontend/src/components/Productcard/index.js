import React from "react"
import { Link } from "react-router-dom"
import "./Productcard.css"
import Button from "../Button"
import item1 from "../../assets/images/item1.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-regular-svg-icons"

const Productcard = ({ itemName, product, price, category, id }) => {
  return (
    <div className="product-card">
      <div className="product-photo">
        <img src={product} alt="product" />
      </div>
      <div className="product-data">
        <h3 className="product-title">{itemName}</h3>
        <div className="product-meta">
          <p className="price">{price}</p>
          <p className="category">{category}</p>
        </div>
        <div className="action-btns">
          <Link to={`/product?id=${id}`}>
            <Button kind="primary">Buy Now</Button>
          </Link>
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
