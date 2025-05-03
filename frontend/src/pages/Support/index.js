import { faHeadset, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"

import "./Support.css"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

function TicketRow({ username, id, title, type, status, date }) {
  return (
    <div className="container ticket-container">
      <div style={{ display: "flex" }}>
        <div className="box2">
          <div className="userprofile">
            <ProfileImage username={username} size={30} /> {username}
          </div>
          <b>Ticket #{id}</b>
        </div>
        <h2>{title}</h2>
      </div>
      <div style={{ display: "grid", justifyItems: "end" }}>
        <div>
          <span className="tickettype">{type}</span>
          <span className={status}>{status}</span>{" "}
          <FontAwesomeIcon icon={faPen} />{" "}
          <FontAwesomeIcon icon={faTrash} color="red" />
        </div>
        <span className="secondary-text">
          <br />
          {date}
        </span>
      </div>
    </div>
  )
}

export default function Support() {
  const [tickets] = useFetch(`${REACT_APP_API_URL}/api/tickets/`, { body: [] })
  const selectOptions = tickets?.body?.map((ticket) => ticket.title)

  return (
    <div className="content">
      <h1>
        {" "}
        <FontAwesomeIcon icon={faHeadset} /> Customer Support
      </h1>
      <div className="box">
        <SearchBar width="75%" />
        <div>
          <Select items={selectOptions || []} />
          <Button kind="primary">New Ticket</Button>{" "}
        </div>
      </div>
      <div className="secondary-text">
        Showing{tickets?.body?.lenght || 0} items...
      </div>
      <br></br>
      <div>
        <h2>Open</h2>

        {tickets?.body?.map((ticket) => (
          <TicketRow
            className="ticket-row"
            id={ticket.id}
            username={ticket.username}
            date={ticket.date}
            status={ticket.ticketstatus}
            title={ticket.title}
            type={ticket.type}
          />
        ))}
      </div>

      <div>
        <h2>Closed</h2>
      </div>
    </div>
  )
}