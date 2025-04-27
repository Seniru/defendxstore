import Table from "../../components/Table"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"
import useFetch from "../../hooks/useFetch"
import { useSearchParams } from "react-router-dom"

const { REACT_APP_API_URL } = process.env

export default function Invoice() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [order] = useFetch(
    `${REACT_APP_API_URL}/api/orders/${searchParams.get("id")}`,
  )

  return (
    <div className="container">
      <div class="header">
        <h1> DefendX Pvt Ltd Invoice</h1>
        <p>Order Number #{order?.body?._id}</p>
        <p>Date: {new Date(order?.body?.orderdate).toLocaleString()}</p>
      </div>
      <div class="section">
        <div class="section-title">
          <h2>Customer Information</h2>
        </div>
        <p>
          <strong>Name:</strong> {order?.body?.user?.username}
        </p>
        <p>
          <strong>Email:</strong> {order?.body?.user?.email}
        </p>
        <p>
          <strong>Shipping Address:</strong> {order?.body?.deliveryAddress}
        </p>
      </div>

      <div className="checkOutInvoice">
        <Table
          headers={["", "Product ", "Color ", "Price", "Quantity", "Subtotal"]}
          rows={[
            ...(order?.body?.items || []).map((item) => [
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                src={item.product}
              />,
              item.itemName,
              <div
                className="color-square"
                style={{ backgroundColor: item.color }}
              />,
              `LKR ${item.price}`,
              item.quantity,
              `LKR ${item.price * item.quantity}`,
            ]),
            [
              <>
                <br />
                <b>Total</b>
                <br />
              </>,

              "",
              "",
              "",
              "",

              <>
                <br />
                <b>LKR {order?.body?.price}</b>
                <br />
              </>,
            ],
          ]}
        />
      </div>
    </div>
  )
}
