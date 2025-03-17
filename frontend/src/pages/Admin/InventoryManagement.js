import React, { useState, useEffect } from "react";
import "./InventoryManagement.css";
import Select from "../../components/Select";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Table from "../../components/Table";
import StockStatus from "../../components/StockStatus"; // Import StockStatus
import axios from "axios";

const API_URL = "http://localhost:5000/api/items"; // Backend API URL

const InventoryManagement = () => {
  const [productData, setProductData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add", "restock", or "edit"
  const [newProduct, setNewProduct] = useState({
    image: null,
    name: "",
    category: "",
    description: "",
    colors: [],
    price: "",
    size: "",
    quantity: 0,
    stock: "In Stock",
  });
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  // Fetch all items from the backend
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Create a new item
  const createItem = async (item) => {
    try {
      const response = await axios.post(API_URL, item);
      return response.data;
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };

  // Update an item
  const updateItem = async (id, item) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, item);
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "colors") {
      setNewProduct({
        ...newProduct,
        colors: value.split(",").map((color) => color.trim()),
      });
    } else if (name === "quantity") {
      setNewProduct({ ...newProduct, quantity: parseInt(value) || 0 });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Add product
  const handleAddProductClick = () => {
    setFormMode("add");
    setNewProduct({
      image: null,
      name: "",
      category: "",
      description: "",
      colors: [],
      price: "",
      size: "",
      quantity: 0,
      stock: "In Stock",
    });
    setIsFormOpen(true);
  };

  // Restock product
  const handleRestockClick = (index) => {
    setFormMode("restock");
    const product = productData[index];
    setNewProduct({ ...product, colors: product.colors.join(", ") });
    setSelectedProductIndex(index);
    setIsFormOpen(true);
  };

  // Edit product
  const handleEditProduct = (index) => {
    setFormMode("edit");
    const product = productData[index];
    setNewProduct({
      ...product,
      colors: product.colors.join(", "),
    });
    setSelectedProductIndex(index);
    setIsFormOpen(true);
  };

  // Form close with default values
  const handleFormClose = () => {
    setIsFormOpen(false);
    setNewProduct({
      image: null,
      name: "",
      category: "",
      description: "",
      colors: [],
      price: "",
      size: "",
      quantity: 0,
      stock: "In Stock",
    });
    setSelectedProductIndex(null);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "add") {
        const createdItem = await createItem(newProduct);
        setProductData([...productData, createdItem]);
      } else if (formMode === "restock") {
        const updatedItem = await updateItem(selectedProductIndex, {
          ...newProduct,
          quantity: newProduct.quantity,
        });
        const updatedProducts = productData.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
        setProductData(updatedProducts);
      } else if (formMode === "edit") {
        const updatedItem = await updateItem(selectedProductIndex, newProduct);
        const updatedProducts = productData.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
        setProductData(updatedProducts);
      }
      handleFormClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (index) => {
    try {
      await deleteItem(productData[index]._id);
      const updatedProducts = productData.filter((_, i) => i !== index);
      setProductData(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
      <div className="secondary-text">Showing {productData.length} products...</div>
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
              src={product.image}
              alt={product.name}
              className="product-image"
              style={{ width: "100px", height: "100px", borderRadius: "10px" }}
            />,
            product.name,
            product.category,
            product.description,
            product.colors.join(", "),
            product.price,
            product.size,
            product.quantity,
            <StockStatus stock={product.stock} />, // Use the imported StockStatus component
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

      {/* Product Form Modal */}
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
                    Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={formMode === "add"}
                    />
                  </label>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Category:
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      <option value="Mens">Mens</option>
                      <option value="Womens">Womens</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </label>
                  <label>
                    Description:
                    <input
                      type="text"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Colors (comma-separated):
                    <input
                      type="text"
                      name="colors"
                      value={newProduct.colors.join(", ")}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="text"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Size (comma-separated):
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
                Quantity:
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
                  Stock Status:
                  <select
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Running Low">Running Low</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </label>
              )}
              <div className="form-actions">
                <Button type="submit">
                  {formMode === "add"
                    ? "Add Product"
                    : formMode === "restock"
                    ? "Update Quantity"
                    : "Save Changes"}
                </Button>
                <Button kind="danger" onClick={handleFormClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;