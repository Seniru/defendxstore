import { LineChart } from "@mui/x-charts/LineChart"
import "./SalesManagement.css"
import Select from "../../components/Select"
import Table from "../../components/Table"
import { PieChart } from "@mui/x-charts/PieChart"
import * as React from "react"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function SalesManagement() {
  const [monthlySales] = useFetch(
    `${REACT_APP_API_URL}/api/sales?period=weekly`,
  )
  const sales = monthlySales

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
  if (sales?.body?.[1]?.incomeData)
    chartData.push({ data: sales.body[1].incomeData, label: "Income" })

  return (
    <div className="content">
      <div className="sales-management-actions">
        View <Select items={["Expected Sales", "Revenue", "Costs", "Profit"]} />
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
        rows={(monthlySales?.body?.[1].revenueData || []).map((row, index) => [
          `LKR ${monthlySales?.body?.[0]?.[index] || ""}`,
          `LKR ${monthlySales?.body?.[1]?.expectedSalesData[index].toFixed(2) || ""}`,
          `LKR ${monthlySales?.body?.[1]?.revenueData[index].toFixed(2) || ""}`,
          `LKR ${monthlySales?.body?.[1]?.costData[index].toFixed(2) || ""}`,
          `LKR ${monthlySales?.body?.[1]?.profitData[index].toFixed(2) || ""}`,
        ])}
      />
    </div>
  )
}
