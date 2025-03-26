import "./promocodes.css"
import SearchBar from "../../components/SearchBar"
import Table from "../../components/Table"
import Button from "../../components/Button"
import Input from "../../components/Input"

function PromoCodeRow({ row, index }) {
  return row.code !== undefined ? (
    <tr key={index}>
      <td>{row.code}</td>
      <td>{row.validUntil}</td>
      <td>{row.discount}</td>
      <td>
        <Button>Edit</Button>
        <Button kind="danger">Delete</Button>
      </td>
    </tr>
  ) : (
    <tr key={index}>
      <td>
        <Input placeholder="Promotion code" />
      </td>
      <td>
        <Input placeholder="Valid until" />
      </td>
      <td>
        <Input placeholder="Discount" />
      </td>
      <td>
        <Button kind="primary">Add code</Button>
      </td>
    </tr>
  )
}

export default function PromoCodes() {
  return (
    <div className="content">
      <h1>Promotion codes</h1>
      <div className="promocodes-actions">
        <SearchBar placeholder={"Promocodes"} />
      </div>

      <Table
        headers={["Promocode", "Valid until", "Discount", ""]}
        rows={[
          {},
          { code: "Summer20", validUntil: "2024-12-31", discount: "20%" },
          { code: "Newuser15", validUntil: "2024-12-31", discount: "20%" },
          { code: "BOGO50", validUntil: "2024-12-31", discount: "25%" },
          { code: "FESTIVE30", validUntil: "2024-12-31", discount: "50%" },
          { code: "Awrudu", validUntil: "2024-12-31", discount: "15%" },
          { code: "Christmas", validUntil: "2024-12-24", discount: "30%" },
        ]}
        renderRowWith={PromoCodeRow}
      />
    </div>
  )
}
