import React, { useState, useEffect } from "react";
import "./InventoryManagement.css";
import Select from "../../components/Select";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Table from "../../components/Table";
import StockStatus from "../../components/StockStatus";
import api from "../../utils/api";

const InventoryManagement = () => {
  const [productData, setProductData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
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

  const fetchItems = async () => {
    try {
      
      const response = await api.get("/items");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched data:", data);
      setProductData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching items:", error);
      setProductData([]);
    }
  };

  const createItem = async (item) => {
    try {
      const response = await api.post("/items", item);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Created item response:", data);
      return {
        ...data,
        colors: Array.isArray(data.colors) ? data.colors : [],
      };
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };

  const updateItem = async (id, item) => {
    try {
      const response = await api.put(`/items/${id}`, item);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

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

  const handleRestockClick = (index) => {
    setFormMode("restock");
    const product = productData[index];
    setNewProduct({ 
      ...product, 
      colors: Array.isArray(product.colors) ? product.colors : []
    });
    setSelectedProductIndex(index);
    setIsFormOpen(true);
  };

  const handleEditProduct = (index) => {
    setFormMode("edit");
    const product = productData[index];
    setNewProduct({
      ...product,
      colors: Array.isArray(product.colors) ? product.colors : [],
    });
    setSelectedProductIndex(index);
    setIsFormOpen(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "add") {
        const itemToCreate = {
          ...newProduct,
          colors: Array.isArray(newProduct.colors) ? newProduct.colors : [],
        };
        const createdItem = await createItem(itemToCreate);
        setProductData([...productData, createdItem]);
      } else if (formMode === "restock") {
        const selectedProduct = productData[selectedProductIndex];
        const updatedItem = await updateItem(selectedProduct._id, {
          ...newProduct,
          quantity: newProduct.quantity,
        });
        const updatedProducts = productData.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
        setProductData(updatedProducts);
      } else if (formMode === "edit") {
        const selectedProduct = productData[selectedProductIndex];
        const updatedItem = await updateItem(selectedProduct._id, newProduct);
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
            Array.isArray(product.colors) ? product.colors.join(", ") : "",
            product.price,
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
                      value={Array.isArray(newProduct.colors) ? newProduct.colors.join(", ") : ""}
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