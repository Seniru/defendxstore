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
import {
  faEllipsisVertical,
  faBoxesStacked,
  faTriangleExclamation,
  faCircleExclamation,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons"
import Menu from "../../components/Menu"
import MessageBox from "../../components/MessageBox"
import { saveAs } from "file-saver"
import QRCode from "react-qr-code"

const { REACT_APP_API_URL } = process.env

const StockCard = ({ title, count, color, backgroundColor, icon }) => {
  return (
    <div className="stock-card" style={{ backgroundColor }}>
      <div className="stock-card-icon">
        <FontAwesomeIcon icon={icon} size="2x" color={color} />
      </div>
      <div className="stock-card-content">
        <h3 className="stock-card-title" style={{ color }}>
          {title}
        </h3>
        <p className="stock-card-count" style={{ color }}>
          {count}
        </p>
      </div>
    </div>
  )
}

const InventoryManagement = () => {
  const { token } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPromocodeWindowOpen, setIsPromocodeWindowOpen] = useState(false)
  const [formMode, setFormMode] = useState("add")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("info")
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
  const [qrCodeData, setQrCodeData] = useState(null)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  // New state for stock counts
  const [stockCounts, setStockCounts] = useState({
    total: 0,
    inStock: 0,
    runningLow: 0,
    outOfStock: 0,
  })

  const [productData] = useFetch(
    `${process.env.REACT_APP_API_URL}/api/items`,
    {},
    refreshFlag,
  )

  useEffect(() => {
    if (productData.body) {
      let results = [...productData.body]

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

      if (selectedFilter !== "All") {
        results = results.filter((product) => product.stock === selectedFilter)
      }

      setFilteredProducts(results)

      // Calculate stock counts for dashboard cards
      const totalItems = productData.body.length
      const inStockItems = productData.body.filter(
        (item) => item.stock === "In Stock",
      ).length
      const lowStockItems = productData.body.filter(
        (item) => item.stock === "Running Low",
      ).length
      const outOfStockItemsCard = productData.body.filter(
        (item) => item.stock === "Out of Stock",
      ).length

      // Update stock counts
      setStockCounts({
        total: totalItems,
        inStock: inStockItems,
        runningLow: lowStockItems,
        outOfStock: outOfStockItemsCard,
      })

      // show notifications
      if (lowStockItems > 0) {
        const itemNames = productData.body
          .filter((item) => item.stock === "Running Low")
          .map((item) => item.itemName)
          .join(", ")
        setMessage(
          `Alert: ${lowStockItems} items are running low on stock: ${itemNames}`,
        )
        setMessageType("warning")
      }

      const outOfStockItems = productData.body.filter(
        (item) => item.stock === "Out of Stock",
      )
      if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems
          .map((item) => item.itemName)
          .join(", ")
        setMessage(
          `Alert: ${outOfStockItems.length} items are out of stock: ${itemNames}`,
        )
        setMessageType("error")
      }
    }
  }, [productData.body, searchQuery, selectedFilter])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle filter dropdown change
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value)
  }

  function ProductRow({ row, index }) {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

    const handleGetQrCode = () => {
      try {
        if (!row._id) {
          throw new Error("Product ID is missing")
        }

        const baseUrl = window.location.origin
        const productUrl = `${baseUrl}/product?id=${encodeURIComponent(row._id)}`

        // Store product data for display
        setQrCodeData({
          id: row._id,
          name: row.itemName || "Unknown Product",
          price: row.price || "N/A",
          category: row.category || "N/A",
          url: productUrl,
        })

        setIsQrModalOpen(true)
      } catch (error) {
        console.error("Error generating QR code:", error)
        setMessage("Failed to generate QR code: " + error.message)
        setMessageType("error")
      }
    }

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
        <td>{`LKR ${row.price}`}</td>
        <td>{row.size.join(", ")}</td>
        <td>{row.quantity}</td>
        <td>
          <StockStatus stock={row.stock} />
        </td>
        <td>
          <Button kind="secondary" onClick={() => handleGetQrCode()}>
            Get QR
          </Button>
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

  const exportToExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/items?downloadSheet=true`,
        {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: "Bearer " + token,
          },
        },
      )

      const blob = await response.blob()
      saveAs(
        blob,
        `Inventory_Report_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )

      setMessage("Excel file exported successfully")
      setMessageType("success")

      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      setMessage("Failed to export Excel file: " + error.message)
      setMessageType("error")
    }
  }

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

  const restockItem = async (id, amount) => {
    await api.post(`/api/items/${id}/restock`, { amount }, token)
    setRefreshFlag(!refreshFlag)
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
        /*await updateItem(selectedProduct._id, {
          quantity: newProduct.quantity,
        })*/
        await restockItem(selectedProduct._id, newProduct.quantity)
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

  //qr
  const handleQrModalClose = () => {
    setIsQrModalOpen(false)
    setQrCodeData(null)
  }
  //qr download
  const downloadQrCode = () => {
    try {
      const svgElement = document
        .getElementById("product-qr-code")
        .querySelector("svg")
      if (!svgElement) {
        throw new Error("QR code SVG element not found")
      }
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = 256
      canvas.height = 256

      // Create an image from the SVG
      const img = new Image()
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      })
      const url = URL.createObjectURL(svgBlob)

      // Once the image loads, draw it to canvas and create download
      img.onload = () => {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const dataURL = canvas.toDataURL("image/png")

        // Create download link
        const link = document.createElement("a")
        link.href = dataURL
        link.download = `qr-${qrCodeData.name.replace(/\s+/g, "-")}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
      }

      img.src = url

      setMessage("QR code downloading...")
      setMessageType("success")
    } catch (error) {
      console.error("Error downloading QR code:", error)
      setMessage("Failed to download QR code: " + error.message)
      setMessageType("error")
    }
  }

  return (
    <>
      {message && (
        <MessageBox
          message={message}
          setMessage={setMessage}
          type={messageType}
          position="top"
        />
      )}
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
            <Button kind="secondary" onClick={exportToExcel}>
              <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
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

        <br />
        <div className="stock-dashboard">
          <StockCard
            title="Total Products"
            count={stockCounts.total}
            color="#27ae60"
            backgroundColor="#e8f8f1"
            icon={faBoxesStacked}
          />
          <StockCard
            title="Running Low"
            count={stockCounts.runningLow}
            color="#f39c12"
            backgroundColor="#fef5e7"
            icon={faTriangleExclamation}
          />
          <StockCard
            title="Out of Stock"
            count={stockCounts.outOfStock}
            color="#e74c3c"
            backgroundColor="#fdedeb"
            icon={faCircleExclamation}
          />
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
              "QR Code",
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

        {/* QR Code Modal */}
        {isQrModalOpen && qrCodeData && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>QR Code for {qrCodeData.name}</h2>
              <div className="qr-container" id="qr-code-container">
                <div id="product-qr-code">
                  <QRCode
                    value={qrCodeData.url}
                    size={256}
                    level="H"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
              <p className="qr-info">
                Scan this QR code to view the product details
              </p>
              <p className="qr-url">
                <small>{qrCodeData.url}</small>
              </p>

              <div className="form-actions">
                <Button onClick={downloadQrCode}>Download QR Code</Button>
                <Button kind="secondary" onClick={handleQrModalClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InventoryManagement
