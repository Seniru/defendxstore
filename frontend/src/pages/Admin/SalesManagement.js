import "./SalesManagement.css"
import Select from "../../components/Select"
import Table from "../../components/Table"

export default function SalesManagement() {
  return (
    
      <div className="content">
      <div className="sales-management-actions">
      View <Select items={["Expected Sales", "Revenue", "Costs", "Profit"]} />
      <br /><h1>Monthly Sales Breakdown</h1> 
      </div>
      
      <Table headers={["Month ", "Expected Sales", "Revenue", "Cost", "Profit"]}
        rows={[
          ["January", "99", "99.9" ,"99.9", "99.9"],
          ["February", "99", "99.9" ,"99.9", "99.9"],
          ["March", "99", "99.9" ,"99.9", "99.9"],
          ["April", "99", "99.9" ,"99.9", "99.9"],
        ]}
        />

    </div>
  )
}