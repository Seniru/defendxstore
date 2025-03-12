import React from "react";
import "./checkout.css";
import product1 from "../../assets/images/item2.jpg";
import Select from "../../components/Select";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";


const Checkout = () => {
  const availableColors = ["black", "white", "grey", "maroon"]; // Example colors

  return (
    <div className="product-checkout">
      <div className="product-image-container">
        <img src={product1} alt="Product" className="product-image" />
      </div>

      <div className="product-details">
        <h2>Over-Sized Relax Tee</h2>
        <p>
          Over-sized tee with a round neck and short sleeves. Made of 100%
          cotton.
        </p>
        <div className="price">LKR 3200.00</div>

        <div className="colors">
          <h3>Colors</h3>
          <div className="color-options">
            {availableColors.map((color, index) => (
              <div
                key={index}
                className="color-square"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div className="sizes">
          <h3>Sizes</h3>
          <div className="size-and-guide">
            <Select items={["S", "M", "L", "XL", "XXL"]} />

            <a href="https://static.vecteezy.com/system/resources/previews/011/188/583/non_2x/short-sleeve-shirt-size-chart-template-infographic-table-of-size-guide-men-shirt-with-collar-and-button-vector.jpg" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faCircleInfo} />
              <h4>Size Guide</h4>
            </a>
          </div>
        </div>

        <div className="quantity">
          <h3>Quantity</h3>
          <Input type="number" placeholder="1" />
        </div>

        <div className="promocode">
          <h3>
            Promo Code<span style={{ color: "red" }}>*</span>
          </h3>
          <Input type="text" placeholder="Enter promo code" />
        </div>

        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

export default Checkout;