import ProfileImage from "../ProfileImage"
import OverlayWindow from "../OverlayWindow"
import { faTrash, faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./TicketRow.css"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import { useState } from "react"
import Button from "../Button"

export default function TicketRow({
  username,
  id,
  title,
  type,
  status,
  date,
  refreshList,
  setRefreshList,
}) {
  const { token } = useAuth()
  const [isDeleteWindowOpen, setIsDeleteWindowOpen] = useState(false)

  const deleteTicket = async () => {
    const response = await api.delete(`/api/tickets/${id}`, {}, token)
    if (response.ok) {
      setRefreshList(!refreshList)
      setIsDeleteWindowOpen(false)
    }
  }

  return (
    <>
      <OverlayWindow
        isOpen={isDeleteWindowOpen}
        setIsOpen={setIsDeleteWindowOpen}
      >
        <h3>Delete ticket</h3>
        <p className="secondary-text">
          <FontAwesomeIcon icon={faWarning} /> Are you sure to delete this
          ticket? This action is irreversible!
        </p>
        <div
          style={{
            display: "grid",
          }}
        >
          <Button kind="danger-secondary" onClick={deleteTicket}>
            Delete ticket
          </Button>
          <Button kind="primary" onClick={() => setIsDeleteWindowOpen(false)}>
            Cancel
          </Button>
        </div>
      </OverlayWindow>
      <div className="container ticket-container">
        <div className="ticket-container-header">
          <span className="secondary-text">
            Ticket <b>#{id}</b>
          </span>
          <div>
            <span className="tickettype">{type.toUpperCase()}</span>
            <span className={status}>{status.toUpperCase()}</span>
            <FontAwesomeIcon
              icon={faTrash}
              color="red"
              cursor="pointer"
              onClick={() => setIsDeleteWindowOpen(true)}
            />
          </div>
        </div>
        <div className="ticket-container-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="userprofile">
              <ProfileImage username={username} size={40} />
              <div>{username}</div>
            </div>
            <Link to={`/ticket?id=${id}`}>
              <h2>{title}</h2>
            </Link>
          </div>
          <div className="secondary-text">
            {new Date(date).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  )
}
