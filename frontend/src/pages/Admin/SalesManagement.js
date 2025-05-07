import { LineChart } from "@mui/x-charts/LineChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faFileExcel } from "@fortawesome/free-solid-svg-icons"
import {
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes"
import Select from "../../components/Select"
import Table from "../../components/Table"
import useFetch from "../../hooks/useFetch"
import Input from "../../components/Input"
import Button from "../../components/Button"
import OverlayWindow from "../../components/OverlayWindow"
import ExpensesForm from "../../forms/ExpensesForm"

import { useMemo, useState } from "react"

import "./SalesManagement.css"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import MessageBox from "../../components/MessageBox"
import { saveAs } from "file-saver"

const { REACT_APP_API_URL } = process.env

export default function SalesManagement() {
  const { token } = useAuth()
  const [dateFrom, setDateFrom] = useState(null)
  const [isExpensesFormOpen, setIsExpensesFormOpen] = useState(false)
  const [isExpensesListOpen, setIsExpensesListOpen] = useState(false)
  const [dateTo, setDateTo] = useState(null)
  const [metric, setMetric] = useState(null)
  const [compareMetric, setCompareMetric] = useState("sales")
  const [compareItems, setCompareItems] = useState([])
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const chartWidth = (window.innerWidth - 50) / 3

  const changeCategory = (evt) => {
    if (evt.target.value === "all") return setMetric(null)
    setMetric(evt.target.value)
  }

  const handleExpenseSubmit = async (expenseData) => {
    const response = await api.post("/api/sales/expenses", expenseData, token)
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    setIsExpensesFormOpen(false)
  }

  const queryParams = useMemo(() => {
    let q = {}
    if (dateFrom) q.dateFrom = dateFrom
    if (dateTo) q.dateTo = dateTo
    if (metric) q.metric = metric
    return new URLSearchParams(q).toString()
  }, [dateFrom, dateTo, metric])

  const compareQueryParams = useMemo(() => {
    let q = { items: compareItems.join(",") }
    if (dateFrom) q.dateFrom = dateFrom
    if (dateTo) q.dateTo = dateTo
    if (compareMetric) q.metric = compareMetric
    return new URLSearchParams(q).toString()
  }, [dateFrom, dateTo, compareMetric, compareItems])

  const [monthlySales] = useFetch(`${REACT_APP_API_URL}/api/sales/monthly`)
  const [sales] = useFetch(`${REACT_APP_API_URL}/api/sales?${queryParams}`)
  const [comparativeSales] = useFetch(
    `${REACT_APP_API_URL}/api/sales/compare?${compareQueryParams}`,
  )
  const [items] = useFetch(`${REACT_APP_API_URL}/api/items`)
  const [expenses] = useFetch(
    `${REACT_APP_API_URL}/api/sales/expenses`,
    { body: [] },
    isExpensesListOpen,
  )
  const [categoricalExpenses] = useFetch(
    `${REACT_APP_API_URL}/api/sales/expenses?categories=true&${queryParams}`,
  )

  const chartData = []
  if (sales?.body?.[1]?.salesData)
    chartData.push({ data: sales.body[1].salesData, label: "Sales" })
  if (sales?.body?.[1]?.costData)
    chartData.push({ data: sales.body[1].costData, label: "Cost" })
  if (sales?.body?.[1]?.expectedSalesData)
    chartData.push({
      data: sales.body[1].expectedSalesData,
      label: "Expected Sales",
    })
  if (sales?.body?.[1]?.profitData)
    chartData.push({ data: sales.body[1].profitData, label: "Revenue" })

  const compareChartData = []
  for (let [k, v] of Object.entries(comparativeSales?.body?.[1] || {}))
    compareChartData.push({ data: v, label: k })

  const exportToExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/sales/monthly?downloadSheet=true`,
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
        `Monthly-Sales-Report-${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  return (
    <>
      <OverlayWindow
        isOpen={isExpensesListOpen}
        setIsOpen={setIsExpensesListOpen}
      >
        <h3>Expenses</h3>
        <hr />
        <div className="expenses-table">
          <Table
            headers={["Date", "Amount", "Category", "Description"]}
            rows={(expenses?.body || []).map((expense) => [
              expense.date.split("T")[0],
              "LKR " + expense.amount.toFixed(2),
              expense.category,
              expense.description,
            ])}
          />
        </div>
      </OverlayWindow>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <div className="content">
        <div className="actions-header">
          <div className="actions-header">
            <div>
              From{" "}
              <Input
                type="date"
                onChange={(evt) => setDateFrom(evt.target.value)}
              />
            </div>
            <div>
              &nbsp; To{" "}
              <Input
                type="date"
                onChange={(evt) => setDateTo(evt.target.value)}
              />
            </div>
          </div>
          <div>
            <Button kind="primary" onClick={() => setIsExpensesListOpen(true)}>
              View Expenses
            </Button>
            <Button kind="primary" onClick={() => setIsExpensesFormOpen(true)}>
              Add Expense
            </Button>
          </div>
        </div>
        <hr />
        <div className="sales-management-actions">
          <div className="container">
            View{" "}
            <Select
              items={{
                all: "All",
                expected_sales: "Expected Sales",
                revenue: "Revenue",
                expenses: "Costs",
                sales: "Sales",
              }}
              onChange={changeCategory}
            />
            <div>
              <LineChart
                height={300}
                width={chartWidth}
                series={chartData}
                xAxis={[
                  {
                    scaleType: "point",
                    data: sales?.body?.[0] || [],
                  },
                ]}
                colors={mangoFusionPalette}
              />
            </div>
          </div>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <span>Compare items...</span>
                <div style={{ width: "max-content" }}>
                  <Select
                    items={(items?.body || []).map((item) => item.itemName)}
                    multiple
                    onMultiChange={setCompareItems}
                  />
                </div>
              </div>
              <div>
                View{" "}
                <Select
                  items={{
                    sales: "Sales",
                    expected_sales: "Expected Sales",
                    revenue: "Revenue",
                    expenses: "Costs",
                  }}
                  onChange={(evt) => setCompareMetric(evt.target.value)}
                />
              </div>
            </div>
            <div>
              <LineChart
                height={300}
                width={chartWidth}
                series={compareChartData}
                xAxis={[
                  {
                    scaleType: "point",
                    data: comparativeSales?.body?.[0] || [],
                  },
                ]}
                colors={mangoFusionPalette}
              />
            </div>
          </div>
          <div className="container">
            <h3>Costs Breakdown</h3>
            <div>
              <PieChart
                series={[
                  {
                    /*data: [
                      { id: 0, value: 15000, label: "Supply costs" },
                      { id: 1, value: 10000, label: "Electricity" },
                      { id: 2, value: 10000, label: "Delivery cost" },
                      { id: 3, value: 45000, label: "Salaries" },
                      { id: 4, value: 3000, label: "Other costs" },
                    ],*/
                    data: (categoricalExpenses?.body?.categories || []).map(
                      (category, index) => ({
                        id: index,
                        value: categoricalExpenses?.body?.expenses[index],
                        label: category,
                      }),
                    ),
                  },
                ]}
                width={400}
                height={200}
                colors={cheerfulFiestaPalette}
              />
            </div>
          </div>
        </div>
        <h3 style={{ display: "flex", alignItems: "center" }}>
          Monthly sales breakdown{" "}
          <Button kind="secondary" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
          </Button>
        </h3>
        <Table
          headers={[
            "Month ",
            <>
              <FontAwesomeIcon
                icon={faBolt}
                color="#ffcc00"
                title="AI-powered sales forecast"
              />{" "}
              Expected Sales
            </>,
            "Revenue",
            "Cost",
            "Profit",
          ]}
          rows={(monthlySales?.body?.[1].salesData || []).map((row, index) => [
            `${new Date(monthlySales?.body?.[0]?.[index]).toLocaleDateString() || ""}`,
            `LKR ${monthlySales?.body?.[1]?.expectedSalesData[index].toFixed(2) || ""}`,
            `LKR ${monthlySales?.body?.[1]?.salesData[index].toFixed(2) || ""}`,
            <span className="error-text">
              ( LKR ${monthlySales?.body?.[1]?.costData[index].toFixed(2) || ""}{" "}
              )
            </span>,
            `LKR ${monthlySales?.body?.[1]?.profitData[index].toFixed(2) || ""}`,
          ])}
        />

        <OverlayWindow
          isOpen={isExpensesFormOpen}
          setIsOpen={setIsExpensesFormOpen}
        >
          <ExpensesForm
            onSubmit={handleExpenseSubmit}
            onCancel={() => setIsExpensesFormOpen(false)}
          />
        </OverlayWindow>
      </div>
    </>
  )
}
