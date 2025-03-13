import React from "react"
import "./InventoryManagement.css"
import Select from "../../components/Select"
import SearchBar from "../../components/SearchBar"
import Button from "../../components/Button"
import Table from "../../components/Table"

import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"
import pic5 from "../../assets/images/pic5.jpg"

const productData = [
  {
    image: pic1,
    name: "Oversized White",
    description: "Premium quality oversized for teenagers",
    colors: ["white", "black", "blue"],
    price: "LKR3200",
    size: "M,L,XL",
    quantity: 120,
    stock: "In Stock",
    promoCode: "10OFF",
  },
  {
    image: pic2,
    name: "Oversized Black",
    description: "Premium quality oversized for teenagers",
    colors: ["white", "blue"],
    price: "LKR3500",
    size: "M,XL,XXL",
    quantity: 100,
    stock: "In Stock",
    promoCode: "",
  },
  {
    image: pic3,
    name: "Premium Jogger Pant",
    description: "Premium quality jogger for individuals",
    colors: ["black", "blue"],
    price: "LKR3200",
    size: "S,M",
    quantity: 20,
    stock: "Running Low",
    promoCode: "FFX",
  },
  {
    image: pic4,
    name: "Karma Limited Edition",
    description: "Premium quality oversized for teenagers",
    colors: ["white", "black", "blue"],
    price: "LKR3200",
    size: "M,L,XL",
    quantity: 0,
    stock: "Out of Stock",
    promoCode: "1FF",
  },
  {
    image: pic5,
    name: "Ladies Top",
    description: "Comfy top for ladies",
    colors: ["white", "black", "blue"],
    price: "LKR3100",
    size: "M",
    quantity: 0,
    stock: "Out of Stock",
    promoCode: "12D",
  },
]

//function to return stock status
const StockStatus = ({ stock }) => {
  let style
  switch (stock) {
    case "In Stock":
      style = {
        width: "90px",
        backgroundColor: "#ffffff",
        color: "#09db65",
        padding: "5px",
        borderRadius: "20px",
        textAlign: "center",
        border: "3px , solid ,#09db65",
      }
      break
    case "Running Low":
      style = {
        width: "90px",
        backgroundColor: "white",
        color: "orange",
        padding: "5px",
        borderRadius: "20px",
        textAlign: "center",
        border: "3px , solid ,orange",
      }
      break
    case "Out of Stock":
      style = {
        width: "90px",
        backgroundColor: "white",
        color: "red",
        padding: "5px",
        borderRadius: "20px",
        textAlign: "center",
        border: "3px , solid ,red",
      }
      break
    default:
      style = {
        backgroundColor: "gray",
        color: "white",
        padding: "5px",
        borderRadius: "20px",
        textAlign: "center",
      }
  }

  return <div style={style}>{stock}</div>
}

const InventoryManagement = () => {
  return (
    <div className="content">
      <div className="inventory-management-actions">
        <SearchBar placeholder={"Search items..."} />
        <span>
          <Select items={["All", "In Stock", "Out of Stock"]} />
          <Button>Add Product</Button>
        </span>
      </div>
      <div className="secondary-text">Showing 999 products...</div>
      <div className="table-container">
        <Table
          headers={[
            "Product",
            "Item Name",
            "Description",
            "Colors",
            "Price",
            "Size",
            "Quantity",
            "Stock",
            "Promo_Code",
            "Action",
          ]}
          rows={productData.map((product) => [
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              style={{ width: "100px", height: "100px", borderRadius: "10px" }}
            />,
            product.name,
            product.description,
            product.colors.join(", "),
            product.price,
            product.size,
            product.quantity,
            <StockStatus stock={product.stock} />,
            product.promoCode,
            <div className="action-buttons">
              <Button kind="primary">Edit</Button>
              <Button kind="danger">Delete</Button>
            </div>,
          ])}
        />
      </div>
    </div>
  )
}

export default InventoryManagement
