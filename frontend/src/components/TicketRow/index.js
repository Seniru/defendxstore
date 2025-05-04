import ProfileImage from "../ProfileImage"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./TicketRow.css"
import { Link } from "react-router-dom"

export default function TicketRow({ username, id, title, type, status, date }) {
  return (
    <div className="container ticket-container">
      <div className="ticket-container-header">
        <span className="secondary-text">
          Ticket <b>#{id}</b>
        </span>
        <div>
          <span className="tickettype">{type.toUpperCase()}</span>
          <span className={status}>{status.toUpperCase()}</span>
          <FontAwesomeIcon icon={faTrash} color="red" />
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
        <div className="secondary-text">{new Date(date).toLocaleString()}</div>
      </div>
    </div>
  )
}
