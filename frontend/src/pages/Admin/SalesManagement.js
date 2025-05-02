import { LineChart } from "@mui/x-charts/LineChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt } from "@fortawesome/free-solid-svg-icons"
import {
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes"
import Select from "../../components/Select"
import Table from "../../components/Table"
import useFetch from "../../hooks/useFetch"

import "./SalesManagement.css"
import Input from "../../components/Input"
import { useMemo, useState } from "react"

const { REACT_APP_API_URL } = process.env

export default function SalesManagement() {
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [metric, setMetric] = useState(null)
  const [compareMetric, setCompareMetric] = useState("sales")
  const [compareItems, setCompareItems] = useState([])
  const chartWidth = (window.innerWidth - 50) / 3

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

  const compareChartData = []
  for (let [k, v] of Object.entries(comparativeSales?.body?.[1] || {}))
    compareChartData.push({ data: v, label: k })

  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          From{" "}
          <Input
            type="date"
            onChange={(evt) => setDateFrom(evt.target.value)}
          />
        </div>
        <div>
          {" "}
          To{" "}
          <Input type="date" onChange={(evt) => setDateTo(evt.target.value)} />
        </div>
        <hr />
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
          <h3>Monthly costs Breakdown</h3>
          <div>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 15000, label: "Supply costs" },
                    { id: 1, value: 10000, label: "Electricity" },
                    { id: 2, value: 10000, label: "Delivery cost" },
                    { id: 3, value: 45000, label: "Salaries" },
                    { id: 4, value: 3000, label: "Other costs" },
                  ],
                },
              ]}
              width={400}
              height={200}
              colors={cheerfulFiestaPalette}
            />
          </div>
        </div>
      </div>
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
