import Table from "../../components/Table"
import pic1 from "../../assets/images/pic1.jpg"
import pic2 from "../../assets/images/pic2.jpg"
import pic3 from "../../assets/images/pic3.jpg"
import pic4 from "../../assets/images/pic4.jpg"

export default function CheckOutInvoice() {
  return (
    <div className="container">
      <div class="header">
        <h1> DefendX Pvt Ltd Invoice</h1>
        <p>Order Number #123456789</p>
        <p>Date: March 24 2025</p>
      </div>
      <div class="section">
        <div class="section-title">
          <h2>Customer Information</h2>
        </div>
        <p>
          <strong>Name:</strong> Rukshan perera
        </p>
        <p>
          <strong>Email:</strong> Perera@example.com
        </p>
        <p>
          <strong>Shipping Address:</strong> 202, Malabe, Srilanka
        </p>
      </div>

      <div className="checkOutInvoice">
        <Table
          headers={["", "Product ", "Color ", "Price", "Quantity", "Subtotal"]}
          rows={[
            [
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                src={pic1}
              />,
              "Oversized Black",
              "Black",
              "3900",
              "2",
              "7800",
            ],

            [
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                src={pic2}
              />,
              "Oversized White",
              "White",
              "3500",
              "1",
              "3500",
            ],
            [
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                src={pic3}
              />,
              "Oversized Black rose",
              "Black",
              "3900",
              "1",
              "3900",
            ],
            [
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                src={pic4}
              />,
              "Oversized maroon rose",
              "maroon",
              "4000",
              "2",
              "8000",
            ],

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
                <b> 8000</b>
                <br />
              </>,
            ],
          ]}
        />
      </div>
    </div>
  )
}
