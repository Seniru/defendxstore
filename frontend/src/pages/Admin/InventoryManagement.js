import React, { useState, useEffect } from "react"
import "./InventoryManagement.css"
import Select from "../../components/Select"
import SearchBar from "../../components/SearchBar"
import Button from "../../components/Button"
import Table from "../../components/Table"
import StockStatus from "../../components/StockStatus"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import useFetch from "../../hooks/useFetch"
import OverlayWindow from "../../components/OverlayWindow"
import PromoCodes from "./promocodes"
import Input from "../../components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import Menu from "../../components/Menu"

const InventoryManagement = () => {
  const { token } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPromocodeWindowOpen, setIsPromocodeWindowOpen] = useState(false)
  const [formMode, setFormMode] = useState("add")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("All") // State for filter dropdown
  const [newProduct, setNewProduct] = useState({
    product: null,
    productPreview: null,
    itemName: "",
    category: "",
    description: "",
    colors: [],
    price: "",
    size: "",
    quantity: 0,
    stock: "In Stock",
  })
  const [selectedProductIndex, setSelectedProductIndex] = useState(null)

  const [productData] = useFetch(
    `${process.env.REACT_APP_API_URL}/api/items`,
    {},
    refreshFlag,
  )

  // Filter products based on search query and dropdown filter
  useEffect(() => {
    if (productData.body) {
      let results = [...productData.body]

      // Apply text search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        results = results.filter(
          (product) =>
            product.itemName?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            (Array.isArray(product.colors) &&
              product.colors.some((color) =>
                color.toLowerCase().includes(query),
              )),
        )
      }

      // Apply dropdown filter
      if (selectedFilter !== "All") {
        results = results.filter((product) => product.stock === selectedFilter)
      }

      setFilteredProducts(results)
    }
  }, [productData.body, searchQuery, selectedFilter])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle filter dropdown change
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value)
  }

  function ProductRow({ row, index }) {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

    return (
      <tr key={index}>
        <td>
          <img
            src={row.product}
            alt={row.itemName}
            className="product-image"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
          />
        </td>
        <td>{row.itemName}</td>
        <td>{row.category}</td>
        <td>{row.description}</td>
        <td>
          <div style={{ display: "flex" }}>
            {row.colors?.map((color, index) => (
              <div
                type="radio"
                name="color"
                value={color}
                key={index}
                className="color-square"
                style={{
                  backgroundColor: color,
                  marginLeft: 1,
                  marginRight: 1,
                }}
              />
            ))}
          </div>
        </td>
        <td>{`$${row.price}`}</td>
        <td>{row.size}</td>
        <td>{row.quantity}</td>
        <td>
          <StockStatus stock={row.stock} />
        </td>
        <td>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            color="var(--secondary-text-color)"
            cursor="pointer"
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
          />
          <Menu isOpen={isContextMenuOpen} right={10}>
            <ul>
              <li onClick={() => handleRestockClick(index)}>Restock</li>
              <li onClick={() => handleEditProduct(index)}>Edit item</li>
              <li onClick={() => handleDeleteProduct(index)}>Delete item</li>
            </ul>
          </Menu>
        </td>
      </tr>
    )
  }

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (newProduct.productPreview) {
        URL.revokeObjectURL(newProduct.productPreview)
      }
    }
  }, [newProduct.productPreview])

  const createItem = async (item) => {
    try {
      const response = await api.post(
        "/api/items",
        {
          product: item.product,
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          colors: item.colors,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          stock: item.stock,
        },
        token,
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`,
        )
      }

      const data = await response.json()
      setRefreshFlag((prev) => !prev)
      return data
    } catch (error) {
      console.error("Item creation failed:", error)
      throw error
    }
  }

  const updateItem = async (id, item) => {
    try {
      const response = await api.put(
        `/api/items/${id}`,
        {
          product: item.product,
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          colors: item.colors,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          stock: item.stock,
        },
        token,
      )

      if (!response.ok) throw new Error(`Update failed: ${response.status}`)

      setRefreshFlag((prev) => !prev)
      return await response.json()
    } catch (error) {
      console.error("Update failed:", error)
      throw error
    }
  }

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/api/items/${id}`, {}, token)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      setRefreshFlag((prev) => !prev)
      return true
    } catch (error) {
      console.error("Error deleting item:", error)
      throw error
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const image = reader.result.split(",")[1]
      setNewProduct({
        ...newProduct,
        product: `data:${file.type};base64,${image}`,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "colors") {
      setNewProduct({
        ...newProduct,
        colors: value.split(",").map((color) => color.trim()),
      })
    } else if (name === "quantity") {
      setNewProduct({ ...newProduct, quantity: parseInt(value) || 0 })
    } else {
      setNewProduct({ ...newProduct, [name]: value })
    }
  }

  const handleAddProductClick = () => {
    setFormMode("add")
    setNewProduct({
      product: null,
      productPreview: null,
      itemName: "",
      category: "",
      description: "",
      colors: [],
      price: "",
      size: "",
      quantity: 0,
      stock: "In Stock",
    })
    setIsFormOpen(true)
  }

  const handleRestockClick = (index) => {
    setFormMode("restock")
    const product = productData.body[index]
    setNewProduct({
      ...product,
      colors: Array.isArray(product.colors) ? product.colors : [],
      productPreview: product.product,
    })
    setSelectedProductIndex(index)
    setIsFormOpen(true)
  }

  const handleEditProduct = (index) => {
    setFormMode("edit")
    const product = productData.body[index]
    setNewProduct({
      ...product,
      colors: Array.isArray(product.colors) ? product.colors : [],
      productPreview: product.product, // Use existing image URL
    })
    setSelectedProductIndex(index)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setNewProduct({
      product: null,
      productPreview: null,
      itemName: "",
      category: "",
      description: "",
      colors: [],
      price: "",
      size: "",
      quantity: 0,
      stock: "In Stock",
    })
    setSelectedProductIndex(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Basic validation
      if (formMode === "add" && !newProduct.product) {
        throw new Error("Please select an image")
      }
      if (!newProduct.itemName || !newProduct.price) {
        throw new Error("Please fill all required fields")
      }

      if (formMode === "add") {
        await createItem(newProduct)
      } else if (formMode === "restock") {
        const selectedProduct = productData.body[selectedProductIndex]
        await updateItem(selectedProduct._id, {
          quantity: newProduct.quantity,
        })
      } else if (formMode === "edit") {
        const selectedProduct = productData.body[selectedProductIndex]
        await updateItem(selectedProduct._id, newProduct)
      }

      handleFormClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (index) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteItem(productData.body[index]._id)
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product")
      }
    }
  }

  return (
    <>
      <OverlayWindow
        isOpen={isPromocodeWindowOpen}
        setIsOpen={setIsPromocodeWindowOpen}
      >
        <PromoCodes />
      </OverlayWindow>
      <div className="content">
        <div className="print-title">Inventory Report</div>
        <div className="inventory-management-actions">
          <SearchBar
            placeholder={"Search items..."}
            onChange={handleSearchChange}
          />
          <span>
            <Button
              kind="secondary"
              onClick={() => setIsPromocodeWindowOpen(true)}
            >
              Promotion codes
            </Button>
            <Button kind="secondary" onClick={() => window.print()}>
              Generate Report
            </Button>
            <Select
              items={["All", "In Stock", "Running Low", "Out of Stock"]}
              onChange={handleFilterChange}
            />
            <Button onClick={handleAddProductClick}>Add Product</Button>
          </span>
        </div>
        <div className="secondary-text">
          Showing {filteredProducts.length} products
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedFilter !== "All" && ` with status "${selectedFilter}"`}
        </div>
        <div className="table-container" id="inventory-table">
          <Table
            headers={[
              "Product",
              "Item Name",
              "Category",
              "Description",
              "Colors",
              "Price",
              "Size",
              "Quantity",
              "Stock",
              "",
            ]}
            rows={filteredProducts}
            renderRowWith={ProductRow}
          />
        </div>

        {isFormOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>
                {formMode === "add"
                  ? "Add New Product"
                  : formMode === "restock"
                    ? "Restock Product"
                    : "Edit Product"}
              </h2>
              <form onSubmit={handleSubmit}>
                {(formMode === "add" || formMode === "edit") && (
                  <>
                    <label>
                      Image:*
                      <Input
                        type="file"
                        name="product"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={formMode === "add"}
                      />
                      {newProduct.productPreview && (
                        <img
                          src={newProduct.productPreview}
                          alt="Preview"
                          style={{ maxWidth: "100px", marginTop: "10px" }}
                        />
                      )}
                    </label>
                    <label>
                      Product Name:*
                      <Input
                        type="text"
                        name="itemName"
                        value={newProduct.itemName}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                    <label>
                      Category:*
                      <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Mens">Mens</option>
                        <option value="Womens">Womens</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </label>
                    <label>
                      Description:*
                      <Input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                    <label>
                      Colors (comma-separated):*
                      <Input
                        type="text"
                        name="colors"
                        value={
                          Array.isArray(newProduct.colors)
                            ? newProduct.colors.join(", ")
                            : ""
                        }
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                    <label>
                      Price:*
                      <Input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </label>
                    <label>
                      Size (comma-separated):*
                      <Input
                        type="text"
                        name="size"
                        value={newProduct.size}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </>
                )}
                <label>
                  Quantity:*
                  <Input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </label>
                {(formMode === "add" || formMode === "edit") && (
                  <label>
                    Stock Status:*
                    <select
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Running Low">Running Low</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </label>
                )}
                <div className="form-actions">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Processing..."
                      : formMode === "add"
                        ? "Add Product"
                        : formMode === "restock"
                          ? "Update Quantity"
                          : "Save Changes"}
                  </Button>
                  <Button
                    kind="danger"
                    onClick={handleFormClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InventoryManagement
