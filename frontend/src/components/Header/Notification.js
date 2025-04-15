import { faClock, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"

export default function Notification({
  notification,
  time,
  index,
  refreshNotifications,
  setRefreshNotifications,
}) {
  const { token } = useAuth()

  const deleteNotification = async () => {
    await api.delete(`/api/notifications/${index}`, {}, token)
    setRefreshNotifications(!refreshNotifications)
  }

  return (
    <div className="notification" key={index}>
      <div>
        <div>{notification}</div>
        <div className="secondary-text">
          <FontAwesomeIcon icon={faClock} /> {new Date(time).toLocaleString()}
        </div>
      </div>
      <FontAwesomeIcon
        icon={faX}
        color="red"
        cursor="pointer"
        onClick={deleteNotification}
      />
    </div>
  )
}
