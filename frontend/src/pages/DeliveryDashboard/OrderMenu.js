import {
  faCheck,
  faClock,
  faFileExcel,
  faTruckMoving,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Order from "../../components/Order"
import Button from "../../components/Button"
import { saveAs } from "file-saver"
import { useAuth } from "../../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

export default function OrderMenu({
  myOngoingDeliveries,
  myPendingDeliveries,
  myCompletedDeliveries,
  unassignedDeliveries,
  refreshOrders,
  setRefreshOrders,
}) {
  const { token } = useAuth()
  const exportOrdersExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/orders?downloadSheet=true`,
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
        `Orders-Report-${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  return (
    <div className="content">
      <Button kind="secondary" onClick={exportOrdersExcel}>
        <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
      </Button>
      <hr />
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
            includeUser={true}
            includeMap={true}
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
            includeUser={true}
            includeMap={true}
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
            includeUser={true}
            includeMap={true}
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
            includeUser={true}
            includeMap={true}
            refreshOrders={refreshOrders}
            setRefreshOrders={setRefreshOrders}
          />
        ))
      )}
    </div>
  )
}
