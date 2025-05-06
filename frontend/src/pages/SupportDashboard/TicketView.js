import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import Button from "../../components/Button"
import TicketRow from "../../components/TicketRow"

import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"
import { useMemo, useRef, useState } from "react"
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../../contexts/AuthProvider"
import { saveAs } from "file-saver"

const { REACT_APP_API_URL } = process.env

export default function TicketView({ refreshTickets, setRefreshTickets }) {
  const { token } = useAuth()
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")

  const searchRef = useRef()
  const queryParams = useMemo(() => {
    const params = {}
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

  const exportTicketsExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/tickets?downloadSheet=true`,
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
        `Tickets-Report-${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  return (
    <div className="content">
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
        <div>
          <Button kind="secondary" onClick={exportTicketsExcel}>
            <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
          </Button>
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
