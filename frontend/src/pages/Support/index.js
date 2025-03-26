import { faHeadset, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"

import "./Support.css"

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
  return (
    <div className="content">
      <h1>
        {" "}
        <FontAwesomeIcon icon={faHeadset} /> Customer Support
      </h1>
      <div className="box">
        <SearchBar width="75%" />
        <div>
          <Select items={["Item 1", "Item 2", "Item 3", "Item 4"]} />
          <Button kind="primary">New Ticket</Button>{" "}
        </div>
      </div>
      <div className="secondary-text">Showing 999 items....</div>
      <br></br>
      <div>
        <h2>Open</h2>

        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Open"}
          title={"Ticket title"}
          type={"Ticket type"}
        />
        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Open"}
          title={"Ticket title"}
          type={"Ticket type"}
        />
        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Open"}
          title={"Ticket title"}
          type={"Ticket type"}
        />

      </div>

      <div>
        <h2>Closed</h2>
        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Closed"}
          title={"Ticket title"}
          type={"Ticket type"}
        />
        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Closed"}
          title={"Ticket title"}
          type={"Ticket type"}
        />
        <TicketRow
          id={1}
          username={"User"}
          date={"2022-01-01"}
          status={"Closed"}
          title={"Ticket title"}
          type={"Ticket type"}
        />
      </div>
    </div>
  )
}
