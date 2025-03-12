import React from "react"
import "./InventoryManagement.css"
import Select from "../../components/Select"
import SearchBar from "../../components/SearchBar"
import Button from "../../components/Button"
import Table from "../../components/Table"
import item1 from "../../assets/images/item1.jpg"
import item2 from "../../assets/images/item2.jpg"
import item3 from "../../assets/images/item3.jpg"
import item4 from "../../assets/images/item4.jpg"
import item5 from "../../assets/images/item5.jpg"
import { text } from "@fortawesome/fontawesome-svg-core"

const productData = [
  {
    image: item1,
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
    image: item2,
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
    image: item3,
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
    image: item4,
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
    image: item5,
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
    <div>
      <h1 className="title">Inventory Management</h1>
      <div className="container">
        <SearchBar placeholder={"search items..."} />
        <Select items={["All", "In Stock", "Out of Stock"]} />
        <div className="addporduct">
          <button>Add Product</button>
        </div>
      </div>
      <div className="secondary-text" style={{ margin: "20px" }}>
        Showing 999 products...
      </div>
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
