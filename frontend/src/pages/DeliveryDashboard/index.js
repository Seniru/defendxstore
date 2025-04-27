import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"
import { useAuth } from "../../contexts/AuthProvider"
import "./DeliveryDashboard.css"
import {
  faCheck,
  faCheckCircle,
  faClock,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import OrderMenu from "./OrderMenu"
import Reviews from "./Reviews"
import TabItem from "../../components/TabMenu/TabItem"
import TabMenu from "../../components/TabMenu"
import { useState } from "react"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function DeliveryDashboard({}) {
  const { user } = useAuth()
  const [refreshOrders, setRefreshOrders] = useState(false)
  const [myPendingDeliveries] = useFetch(
    `${REACT_APP_API_URL}/api/deliveries/my?status=pending`,
    {
      body: [],
    },
    refreshOrders,
  )
  const [myOngoingDeliveries] = useFetch(
    `${REACT_APP_API_URL}/api/deliveries/my?status=on_the_way`,
    {
      body: [],
    },
    refreshOrders,
  )
  const [myCompletedDeliveries] = useFetch(
    `${REACT_APP_API_URL}/api/deliveries/my?status=delivered`,
    {
      body: [],
    },
    refreshOrders,
  )
  const [unassignedDeliveries] = useFetch(
    `${REACT_APP_API_URL}/api/deliveries/unassigned`,
    {
      body: [],
    },
    refreshOrders,
  )

  return (
    <div className="agent-dashboard-main">
      <aside className="profile-details">
        <div className="profile-image-containter">
          <ProfileImage username={user.username} size={100} />
        </div>
        <br />
        Welcome,
        <br />
        <b className="username">{user.username}</b>
        <hr />
        <br />
        <div className="profile-title">
          <FontAwesomeIcon icon={faTruck} /> Ongoing deliveries
        </div>
        {myOngoingDeliveries?.body?.length}
        <br />
        <br />
        <div className="profile-title">
          <FontAwesomeIcon icon={faClock} /> Pending deliveries
        </div>
        {myPendingDeliveries?.body?.length}
        <br />
        <br />
        <div className="profile-title">
          <FontAwesomeIcon icon={faCheck} /> Completed deliveries
        </div>
        {myCompletedDeliveries?.body?.length}
      </aside>
      <div className="dashboard-content">
        <TabMenu>
          <TabItem
            name="Orders"
            element={
              <OrderMenu
                refreshOrders={refreshOrders}
                setRefreshOrders={setRefreshOrders}
                myPendingDeliveries={myPendingDeliveries}
                myOngoingDeliveries={myOngoingDeliveries}
                myCompletedDeliveries={myCompletedDeliveries}
                unassignedDeliveries={unassignedDeliveries}
              />
            }
          />
          <TabItem name="Reviews" element={<Reviews />} />
        </TabMenu>
      </div>
    </div>
  )
}
