import "./SupplyManagement.css"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Table from "../../components/Table"

export default function SupplyManagement() {
  return (
    
      <div className="content">
      <div className="supply-management-actions">
        <SearchBar placeholder={"Search items"} />
        
      </div>
      <div className="secondary-text">Showing 999 products...</div>
      <Table headers={[" ", "Item", "Quantity", "Estimated Cost","Estimated Selling Price","Expected Profit"]}
        rows={[
          ["Order #1", "Item #1", "99", "99.9" ,"99.9", "99.9"],
          ["Order #2", "Item #2", "99", "99.9" ,"99.9", "99.9"],
          ["Order #3", "Item #3", "99", "99.9" ,"99.9", "99.9"],
          ["Order #4", "Item #4", "99", "99.9" ,"99.9", "99.9"],
        ]}
        />

    </div>
  )
}