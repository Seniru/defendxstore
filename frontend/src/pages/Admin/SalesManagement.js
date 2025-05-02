import { LineChart } from "@mui/x-charts/LineChart"
import "./SalesManagement.css"
import Select from "../../components/Select"
import Table from "../../components/Table"
import { PieChart } from "@mui/x-charts/PieChart"
import * as React from "react"
import { useState } from "react"
import Button from "../../components/Button"
import OverlayWindow from "../../components/OverlayWindow"
import ExpensesForm from "../../forms/ExpensesForm"

export default function SalesManagement() {
  const [isExpensesFormOpen, setIsExpensesFormOpen] = useState(false);

  const handleExpenseSubmit = (expenseData) => {
    // Handle the expense data - send to API, update state, etc.
    console.log("New expense:", expenseData);
    setIsExpensesFormOpen(false);
  };

  return (
    <div className="content">
      <div className="sales-management-actions">
        <div className="actions-header">
          <div>
            View <Select items={["Expected Sales", "Revenue", "Costs", "Profit"]} />
          </div>
          <Button kind="primary" onClick={() => setIsExpensesFormOpen(true)}>
            Add Expense
          </Button>
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <div>
            <LineChart
              height={300}
              width={1000}
              series={[
                {
                  data: [12, 32, 32, 43, 64, 43, 24, 53, 23, 54, 65, 40],
                  label: "Revenue",
                },
                {
                  data: [8, 24, 26, 35, 50, 36, 18, 42, 17, 45, 55, 30],
                  label: "Cost",
                },
                {
                  data: [4, 8, 6, 8, 14, 7, 6, 11, 6, 9, 10, 10],
                  label: "profit",
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "Novemeber",
                    "Decemeber",
                  ],
                },
              ]}
            />
          </div>
          <div>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 15000, label: "Supply costs" },
                    { id: 1, value: 10000, label: "Electricity" },
                    { id: 2, value: 10000, label: "Delivery cost" },
                    { id: 3, value: 45000, label: "Salaries" },
                    { id: 2, value: 3000, label: "Other costs" },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
          </div>
        </div>
        <h1>Monthly Sales Breakdown</h1>
      </div>

      <Table
        headers={["Month ", "Expected Sales", "Revenue", "Cost", "Profit"]}
        rows={[
          ["January", "99", "99.9", "99.9", "99.9"],
          ["February", "99", "99.9", "99.9", "99.9"],
          ["March", "99", "99.9", "99.9", "99.9"],
          ["April", "99", "99.9", "99.9", "99.9"],
        ]}
      />

      <OverlayWindow isOpen={isExpensesFormOpen} setIsOpen={setIsExpensesFormOpen}>
        <ExpensesForm 
          onSubmit={handleExpenseSubmit}
          onCancel={() => setIsExpensesFormOpen(false)}
        />
      </OverlayWindow>
    </div>
  )
}
