import { useState } from "react"
import "./ExpensesForm.css"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWarning } from "@fortawesome/free-solid-svg-icons"

export default function ExpensesForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "Supply costs",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="expenses-form">
      <h2>Add New Expense</h2>
      <hr />
      <FontAwesomeIcon icon={faWarning} /> Make sure to double check the date and amount
      <br /><br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <Input
            type="date"
            id="date"
            name="date"
            width={"100%"}
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <Input
            type="number"
            id="amount"
            name="amount"
            width={"100%"}
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            items={[
              "Supply costs",
              "Electricity",
              "Delivery cost",
              "Salaries",
              "Other costs",
            ]}
          />
        </div>

        <div className="form-actions">
          <Button kind="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button kind="primary" type="submit">
            Save Expense
          </Button>
        </div>
      </form>
    </div>
  )
}
