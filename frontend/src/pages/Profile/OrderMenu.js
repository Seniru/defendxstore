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
import Order from "../../components/Order"

const { REACT_APP_API_URL } = process.env

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
        (orders?.body || []).map((order) => (
          <Order order={order} includeAgent={!!order.assignedAgent} />
        ))
      )}
    </div>
  )
}
