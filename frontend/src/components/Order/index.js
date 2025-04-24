import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./Order.css"
import {
  faBoxesPacking,
  faCalendar,
  faCheckCircle,
  faChevronRight,
  faMap,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import Button from "../Button"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import MessageBox from "../MessageBox"
import { useState } from "react"

export default function Order({
  order,
  includeAcquireButton,
  includeStartDeliveryButton,
  includeCompleteDeliveryButton,
  refreshOrders,
  setRefreshOrders,
}) {
  const { token } = useAuth()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(false)

  const acquireDelivery = async () => {
    const response = await api.post(
      `/api/orders/${order._id}/delivery`,
      {},
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(response.ok ? "Delivery acquired" : result.body)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const startDelivery = async () => {
    const response = await api.put(
      `/api/orders/${order._id}/delivery`,
      { status: "on_the_way" },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const completeDelivery = async () => {
    const response = await api.put(
      `/api/orders/${order._id}/delivery`,
      { status: "delivered" },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
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
            <br />
            {includeAcquireButton && (
              <Button kind="primary" onClick={acquireDelivery}>
                <FontAwesomeIcon icon={faBoxesPacking} /> Acquire delivery
              </Button>
            )}
            {includeStartDeliveryButton && (
              <Button kind="primary" onClick={startDelivery}>
                <FontAwesomeIcon icon={faTruck} /> Start delivery
              </Button>
            )}
            {includeCompleteDeliveryButton && (
              <Button kind="primary" onClick={completeDelivery}>
                <FontAwesomeIcon icon={faCheckCircle} /> Complete delivery
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
