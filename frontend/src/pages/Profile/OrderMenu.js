import "./Profile.css"
import Select from "../../components/Select"
import useFetch from "../../hooks/useFetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendar,
  faChevronRight,
  faMap,
} from "@fortawesome/free-solid-svg-icons"
import { useMemo, useState } from "react"

const { REACT_APP_API_URL } = process.env

function Order({ order }) {
  return (
    <div className="profile-order-container container">
      <div className="order-header">
        <div>
          <a href={`invoice?id=${order._id}`}>
            #{order._id} <FontAwesomeIcon icon={faChevronRight} />
          </a>
        </div>
        <div
          className="order-status"
          style={{
            backgroundColor: {
              pending: "#FACC15", // amber-400
              on_the_way: "#38BDF8", // sky-400
              delivered: "#4ADE80", // green-400
            }[order.status],
          }}
        >
          {order.status.toUpperCase().replaceAll("_", " ")}
        </div>
      </div>
      <div className="order-body">
        <img
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "10px",
          }}
          src={order.items[0].product}
        />
        <div className="order-details">
          <span className="secondary-text">
            <FontAwesomeIcon icon={faCalendar} />{" "}
            {new Date(order.orderdate).toLocaleString()}
          </span>
          <span className="secondary-text"> | </span>
          <span className="secondary-text">
            <FontAwesomeIcon icon={faMap} /> {order.deliveryAddress}
          </span>
          <br />
          <br />
          <div>
            {order.items.map((item) => (
              <div className="order-item">
                <div
                  className="color-square"
                  style={{
                    backgroundColor: item.color,
                    display: "inline-block",
                    marginRight: 10,
                  }}
                ></div>
                <div>
                  <div>
                    <b>{item.itemName}</b> ({item.size})
                  </div>
                  <div>
                    LKR {item.price}{" "}
                    <span className="secondary-text"> x {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <br />
          <hr />
          <div>
            Total: <b>LKR {order.price}</b>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderMenu() {
  const [status, setStatus] = useState("all")
  const queryParams = useMemo(() => {
    let params = {}
    if (status !== "all") params.status = status
    return new URLSearchParams(params).toString()
  }, [status])

  const [orders] = useFetch(`${REACT_APP_API_URL}/api/orders?${queryParams}`, {
    body: [],
  })

  return (
    <div className="content">
      <div>
        Orders/Deliveries status
        <Select
          items={{
            all: "All",
            pending: "Pending",
            on_the_way: "On the way",
            delivered: "Delivered",
          }}
          onChange={(evt) => setStatus(evt.target.value)}
        />
      </div>
      {orders?.body?.length == 0 ? (
        <span className="secondary-text">No orders to display</span>
      ) : (
        (orders?.body || []).map((order) => <Order order={order} />)
      )}
    </div>
  )
}
