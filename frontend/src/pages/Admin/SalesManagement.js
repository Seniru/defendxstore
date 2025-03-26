import { LineChart } from "@mui/x-charts/LineChart"
import "./SalesManagement.css"
import Select from "../../components/Select"
import Table from "../../components/Table"
import { PieChart } from '@mui/x-charts/PieChart';
import * as React from 'react';

export default function SalesManagement() {
  return (
    <div className="content">
      <div className="sales-management-actions">
        View <Select items={["Expected Sales", "Revenue", "Costs", "Profit"]} />
        <br />
        <div style={{ display: "flex" }}>
          <div>
            <LineChart
              height={300}
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
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
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
    </div>
  )
}
