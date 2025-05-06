import { faHeadset, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Button from "../../components/Button"
import TicketRow from "../../components/TicketRow"

import "./Support.css"
import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"
import { useMemo, useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

export default function Support() {
  const { user } = useAuth()
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")
  const [refreshTickets, setRefreshTickets] = useState(false)

  const searchRef = useRef()
  const queryParams = useMemo(() => {
    const params = { fromUser: user.username }
    if (category !== "all") params.category = category
    if (query) params.q = query
    return new URLSearchParams(params).toString()
  }, [category, query])

  const [openTickets] = useFetch(
    `${REACT_APP_API_URL}/api/tickets?status=open&${queryParams}`,
    {
      body: [],
    },
    refreshTickets,
  )
  const [closedTickets] = useFetch(
    `${REACT_APP_API_URL}/api/tickets?status=closed&${queryParams}`,
    {
      body: [],
    },
    refreshTickets,
  )

  return (
    <div className="content">
      <h1>
        {" "}
        <FontAwesomeIcon icon={faHeadset} /> Customer Support
      </h1>
      <Link to="/ticket/new">
        <Button kind="primary">Open a New Ticket</Button>
      </Link>
      <hr />
      <br />
      <div className="support-top-action-bar">
        <div>
          <SearchBar
            width={400}
            placeholder="Search tickets..."
            ref={searchRef}
          />{" "}
          <Button
            kind="primary"
            onClick={() => setQuery(searchRef.current.value)}
          >
            Go
          </Button>
        </div>
        <Select
          items={{
            all: "All",
            inquiry: "Inquiry",
            payment: "Payment",
            return: "Return Order",
            complaints: "Complaints",
          }}
          onChange={(evt) => setCategory(evt.target.value)}
        />
      </div>
      <div>
        <h2>Open tickets</h2>
        {(openTickets?.body?.length || 0) === 0 ? (
          <div className="secondary-text">No tickets to display...</div>
        ) : (
          <>
            <div className="secondary-text">
              Showing {openTickets?.body?.length || 0} items...
            </div>
            <br />

            {openTickets?.body?.map((ticket) => (
              <TicketRow
                id={ticket._id}
                username={ticket.user.username}
                date={ticket.date}
                status={ticket.ticketstatus}
                title={ticket.title}
                type={ticket.type}
                refreshList={refreshTickets}
                setRefreshList={setRefreshTickets}
              />
            ))}
          </>
        )}
      </div>
      <div>
        <h2>Closed tickets</h2>
        {(closedTickets?.body?.length || 0) === 0 ? (
          <div className="secondary-text">No tickets to display...</div>
        ) : (
          <>
            <div className="secondary-text">
              Showing {closedTickets?.body?.length || 0} items...
            </div>
            <br />

            {closedTickets?.body?.map((ticket) => (
              <TicketRow
                id={ticket._id}
                username={ticket.user.username}
                date={ticket.date}
                status={ticket.ticketstatus}
                title={ticket.title}
                type={ticket.type}
                refreshList={refreshTickets}
                setRefreshList={setRefreshTickets}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
