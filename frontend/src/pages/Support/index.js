import { faHeadset, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Button from "../../components/Button"
import TicketRow from "../../components/TicketRow"

import "./Support.css"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

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
        Showing {tickets?.body?.length || 0} items...
      </div>
      <br></br>
      <div>
        <h2>Open</h2>

        {tickets?.body?.map((ticket) => (
          <TicketRow
            id={ticket._id}
            username={ticket.user.username}
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
