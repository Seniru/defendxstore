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

const InventoryManagement = () => {
  const { token } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState("add")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newProduct, setNewProduct] = useState({
    product: null, // Backend expects 'product' for image
    productPreview: null, // For displaying preview
    itemName: "", // Backend expects 'itemName'
    category: "",
    description: "",
    colors: [],
    price: "",
    size: "",
    quantity: 0,
    stock: "In Stock",
  })
  const [selectedProductIndex, setSelectedProductIndex] = useState(null)

  const [productData, setProductData] = useFetch(
    `${process.env.REACT_APP_API_URL}/api/items`,
    [],
    refreshFlag,
  )

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
      const formData = new FormData()

      // Append all fields with backend-expected names
      formData.append("product", item.product)
      formData.append("itemName", item.itemName)
      formData.append("category", item.category)
      formData.append("description", item.description)
      formData.append("colors", JSON.stringify(item.colors))
      formData.append("price", item.price)
      formData.append("size", item.size)
      formData.append("quantity", item.quantity)
      formData.append("stock", item.stock)

      const response = await api.post("/api/items", formData, token, true)

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
      const formData = new FormData()

      // Same field names as createItem
      if (item.product) formData.append("product", item.product)
      formData.append("itemName", item.itemName)
      formData.append("category", item.category)
      formData.append("description", item.description)
      formData.append("colors", JSON.stringify(item.colors))
      formData.append("price", item.price)
      formData.append("size", item.size)
      formData.append("quantity", item.quantity)
      formData.append("stock", item.stock)

      const response = await api.put(`/api/items/${id}`, formData, token, true)

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
    const product = productData[index]
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
    const product = productData[index]
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
        const selectedProduct = productData[selectedProductIndex]
        await updateItem(selectedProduct._id, {
          quantity: newProduct.quantity,
        })
      } else if (formMode === "edit") {
        const selectedProduct = productData[selectedProductIndex]
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
        await deleteItem(productData[index]._id)
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product")
      }
    }
  }

  return (
    <div className="content">
      <div className="print-title">Inventory Report</div>
      <div className="inventory-management-actions">
        <SearchBar placeholder={"Search items..."} />
        <span>
          <Button kind="secondary" onClick={() => window.print()}>
            Generate Report
          </Button>
          <Select items={["All", "In Stock", "Out of Stock"]} />
          <Button onClick={handleAddProductClick}>Add Product</Button>
        </span>
      </div>
      <div className="secondary-text">
        Showing {productData.length} products...
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
            "Action",
          ]}
          rows={productData.map((product, index) => [
            <img
              src={product.product}
              alt={product.itemName}
              className="product-image"
              style={{ width: "100px", height: "100px", borderRadius: "10px" }}
            />,
            product.itemName,
            product.category,
            product.description,
            Array.isArray(product.colors) ? product.colors.join(", ") : "",
            `$${product.price}`,
            product.size,
            product.quantity,
            <StockStatus stock={product.stock} />,
            <div className="action-buttons">
              <Button
                kind="secondary"
                onClick={() => handleRestockClick(index)}
              >
                Restock
              </Button>
              <Button kind="primary" onClick={() => handleEditProduct(index)}>
                Edit
              </Button>
              <Button kind="danger" onClick={() => handleDeleteProduct(index)}>
                Delete
              </Button>
            </div>,
          ])}
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
                    <input
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
                    <input
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
                    <input
                      type="text"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Colors (comma-separated):*
                    <input
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
                    <input
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
                    <input
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
                <input
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
  )
}

export default InventoryManagement
