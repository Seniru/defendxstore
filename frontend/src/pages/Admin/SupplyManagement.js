import "./SupplyManagement.css"
import Table from "../../components/Table"
import useFetch from "../../hooks/useFetch"
import Button from "../../components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import { saveAs } from "file-saver"
import { useAuth } from "../../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

export default function SupplyManagement() {
  const { token } = useAuth()
  const [supplies] = useFetch(`${REACT_APP_API_URL}/api/sales/supplyMetrics`, {
    body: [],
  })

  const exportToExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/sales/supplyMetrics?downloadSheet=true`,
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
        `Supplies-Report-${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  return (
    <div className="content">
      <div className="supply-management-actions">
        {" "}
        <Button kind="secondary" onClick={exportToExcel}>
          <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
        </Button>
      </div>
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
