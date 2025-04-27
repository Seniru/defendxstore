import { LineChart } from "@mui/x-charts/LineChart"
import { PieChart } from "@mui/x-charts/PieChart"
import {
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes"
import Select from "../../components/Select"
import Table from "../../components/Table"
import useFetch from "../../hooks/useFetch"

import "./SalesManagement.css"
import Input from "../../components/Input"
import { useMemo, useRef, useState } from "react"

const { REACT_APP_API_URL } = process.env

export default function SalesManagement() {
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [metric, setMetric] = useState(null)

  const changeCategory = (evt) => {
    if (evt.target.value === "all") return setMetric(null)
    setMetric(evt.target.value)
  }

  const queryParams = useMemo(() => {
    let q = {}
    if (dateFrom) q.dateFrom = dateFrom
    if (dateTo) q.dateTo = dateTo
    if (metric) q.metric = metric
    return new URLSearchParams(q).toString()
  }, [dateFrom, dateTo, metric])
  const [monthlySales] = useFetch(`${REACT_APP_API_URL}/api/sales/monthly`)
  const [sales] = useFetch(`${REACT_APP_API_URL}/api/sales?${queryParams}`)

  const chartData = []
  if (sales?.body?.[1]?.revenueData)
    chartData.push({ data: sales.body[1].revenueData, label: "Revenue" })
  if (sales?.body?.[1]?.costData)
    chartData.push({ data: sales.body[1].costData, label: "Cost" })
  if (sales?.body?.[1]?.expectedSalesData)
    chartData.push({
      data: sales.body[1].expectedSalesData,
      label: "Expected Sales",
    })
  if (sales?.body?.[1]?.profitData)
    chartData.push({ data: sales.body[1].profitData, label: "Sales" })

  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Compare items...</span>
        <Select items={["Apple", "Orange"]} multiple />
      </div>
      <hr />
      <div className="sales-management-actions">
        <div className="action">
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
        </div>
        <div className="action">
          From{" "}
          <Input
            type="date"
            onChange={(evt) => setDateFrom(evt.target.value)}
          />
        </div>
        <div className="action">
          To{" "}
          <Input type="date" onChange={(evt) => setDateTo(evt.target.value)} />
        </div>
      </div>
      <br />
      <div style={{ display: "flex" }}>
        <div>
          <LineChart
            height={300}
            width={1000}
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
            colors={cheerfulFiestaPalette}
          />
        </div>
      </div>
      <h1>Monthly Sales Breakdown</h1>
      <Table
        headers={["Month ", "Expected Sales", "Revenue", "Cost", "Profit"]}
        rows={(monthlySales?.body?.[1].revenueData || []).map((row, index) => [
          `${monthlySales?.body?.[0]?.[index] || ""}`,
          `LKR ${monthlySales?.body?.[1]?.expectedSalesData[index].toFixed(2) || ""}`,
          `LKR ${monthlySales?.body?.[1]?.revenueData[index].toFixed(2) || ""}`,
          <span className="error-text">
            ( LKR ${monthlySales?.body?.[1]?.costData[index].toFixed(2) || ""} )
          </span>,
          `LKR ${monthlySales?.body?.[1]?.profitData[index].toFixed(2) || ""}`,
        ])}
      />
    </div>
  )
}
