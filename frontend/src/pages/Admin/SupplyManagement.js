import "./SupplyManagement.css"
import Table from "../../components/Table"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function SupplyManagement() {
  const [supplies] = useFetch(`${REACT_APP_API_URL}/api/sales/supplyMetrics`, {
    body: [],
  })

  return (
    <div className="content">
      <div className="supply-management-actions"></div>
      <div className="secondary-text">
        Showing {supplies.body?.length || 0} supply orders...
      </div>
      <Table
        headers={[
          " ",
          "Date",
          "Item",
          "Quantity",
          "Estimated Selling Price",
          "Estimated Cost",
          "Expected Profit",
        ]}
        rows={(supplies?.body || []).map((supply) => [
          `Order #${supply._id}`,
          supply.date.split("T")[0],
          supply.item.itemName,
          supply.orderedQuantity,
          supply.estimatedSellingPrice,
          <span className="error-text">( {supply.estimatedCost} )</span>,
          supply.estimatedProfit,
        ])}
      />
    </div>
  )
}
