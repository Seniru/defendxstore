import {
  faCheck,
  faClock,
  faTruckMoving,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Order from "../../components/Order"

export default function OrderMenu({
  myOngoingDeliveries,
  myPendingDeliveries,
  myCompletedDeliveries,
  unassignedDeliveries,
  refreshOrders,
  setRefreshOrders,
}) {
  return (
    <div className="content">
      <h3>
        <FontAwesomeIcon icon={faTruckMoving} /> My ongoing deliveries
      </h3>
      {myOngoingDeliveries?.body?.length === 0 ? (
        <div className="secondary-text">You have no ongoing deliveries</div>
      ) : (
        myOngoingDeliveries?.body?.map((order) => (
          <Order
            order={order}
            includeCompleteDeliveryButton={true}
            refreshOrders={refreshOrders}
            setRefreshOrders={setRefreshOrders}
          />
        ))
      )}

      <br />
      <hr />
      <h3>
        <FontAwesomeIcon icon={faClock} /> My pending deliveries
      </h3>
      {myPendingDeliveries?.body?.length === 0 ? (
        <div className="secondary-text">You have no pending deliveries</div>
      ) : (
        myPendingDeliveries?.body?.map((order) => (
          <Order
            order={order}
            includeStartDeliveryButton={true}
            refreshOrders={refreshOrders}
            setRefreshOrders={setRefreshOrders}
          />
        ))
      )}

      <br />
      <hr />
      <h3>
        <FontAwesomeIcon icon={faUserMinus} /> Unassigned deliveries
      </h3>
      {unassignedDeliveries?.body?.length === 0 ? (
        <div className="secondary-text">There are no unassigned deliveries</div>
      ) : (
        unassignedDeliveries?.body?.map((order) => (
          <Order
            order={order}
            includeAcquireButton={true}
            refreshOrders={refreshOrders}
            setRefreshOrders={setRefreshOrders}
          />
        ))
      )}

      <br />
      <hr />
      <h3>
        <FontAwesomeIcon icon={faCheck} /> My completed deliveries
      </h3>
      {myCompletedDeliveries?.body?.length === 0 ? (
        <div className="secondary-text">You have no completed deliveries</div>
      ) : (
        myCompletedDeliveries?.body?.map((order) => (
          <Order
            order={order}
            refreshOrders={refreshOrders}
            setRefreshOrders={setRefreshOrders}
          />
        ))
      )}
    </div>
  )
}
