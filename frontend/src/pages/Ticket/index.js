import {
  faAt,
  faCheck,
  faCheckCircle,
  faClock,
  faHeadset,
  faList,
  faPen,
  faPencil,
  faPhone,
  faSun,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"

import "./Ticket.css"
import Button from "../../components/Button"
import Table from "../../components/Table"
import OverlayWindow from "../../components/OverlayWindow"
import { useNavigate, useSearchParams } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
import { useAuth } from "../../contexts/AuthProvider"
import { useState } from "react"
import api from "../../utils/api"
import CreateTicketForm from "../../forms/CreateTicketForm"

const { REACT_APP_API_URL } = process.env

export default function Ticket() {
  const { user, token } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [refreshTicket, setRefreshTicket] = useState(false)
  const [isEditTicketWindowOpen, setIsEditTicketWindowOpen] = useState(false)
  const id = searchParams.get("id")

  const deleteTicket = async () => {
    const response = await api.delete(`/api/tickets/${id}`, {}, token)
    if (response.ok) {
      navigate("/support")
    }
  }

  const editTicket = async (evt, titleRef, typeRef, contentRef) => {
    evt.preventDefault()
    
    const response = await api.put(`/api/tickets/${id}`, {
      title: titleRef.current.value,
      type: typeRef.current.value,
      content: contentRef.current.value
    }, token)

    if (response.ok) {
      setIsEditTicketWindowOpen(false)
      setRefreshTicket(!refreshTicket)
    }
  }

  const resolveTicket = async () => {
    const response = await api.patch(`/api/tickets/${id}`, {}, token)
    if (response.ok) setRefreshTicket(!refreshTicket)
  }

  const [ticket, loading, error] = useFetch(
    `${REACT_APP_API_URL}/api/tickets/${id}`,
    {
      body: [],
    },

    refreshTicket,
  )

  if (loading) return <div className="content"> Loading...</div>
  if (error) return <div className="content"> Error: {error.message}</div>
  if (!ticket) return <div className="content"> Ticket not found</div>

  const formattedDate = ticket.body?.date
    ? new Date(ticket.body?.date).toLocaleString()
    : "No date"

  return (
    <>
      <OverlayWindow
        isOpen={isEditTicketWindowOpen}
        setIsOpen={setIsEditTicketWindowOpen}
      >
        <CreateTicketForm
          handleSubmit={editTicket}
          title={ticket?.body?.title}
          type={ticket?.body?.type}
          content={ticket?.body?.content}
        />
      </OverlayWindow>
      <div className="content">
        <div className="ticket-container">
          <div className="ticket-header">
            <h4 className="secondary-text">Ticket #{ticket?.body?._id}</h4>
            <div className={ticket?.body?.ticketstatus}>
              {ticket?.body?.ticketstatus.toUpperCase()}
            </div>
          </div>
          <h1>{ticket?.body?.title}</h1>
          <Table
            headers={[]}
            rows={[
              [
                <span className="secondary-text">
                  <FontAwesomeIcon icon={faUser} /> Submitted by
                </span>,
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ProfileImage
                      username={ticket?.body?.user?.username || "Unknown"}
                      size={30}
                    />
                    <div style={{ marginLeft: 5 }}>
                      {ticket?.body?.user?.username || "Unknown User"}
                    </div>
                  </div>
                </div>,
                <div />,
                <div />,
                <div />,
                <div />,
                <div />,
              ],
              [
                <span className="secondary-text">
                  <FontAwesomeIcon icon={faAt} /> Email
                </span>,
                ,
                ticket?.body?.user?.email,
                <div />,
                <div />,
                <div />,
                <div />,
                <div />,
              ],
              [
                <span className="secondary-text">
                  <FontAwesomeIcon icon={faPhone} /> Contact number
                </span>,
                ,
                ticket?.body?.user?.contactNumber[0] || "N/A",
                <div />,
                <div />,
                <div />,
                <div />,
                <div />,
              ],
              [
                <span className="secondary-text">
                  <FontAwesomeIcon icon={faClock} /> Submitted date and time
                </span>,
                formattedDate,
                <div />,
                <div />,
                <div />,
                <div />,
                <div />,
              ],
              [
                <span className="secondary-text">
                  <FontAwesomeIcon icon={faList} /> Type
                </span>,
                ticket?.body?.type || "No Type",
                <div className="filler-div" />,
                <div />,
                <div />,
                <div />,
                <div />,
              ],
            ]}
          />

          <div className="ticket-content">
            <h3>Content</h3>
            <div>
              <Button
                kind="secondary"
                onClick={() => setIsEditTicketWindowOpen(true)}
              >
                <FontAwesomeIcon icon={faPencil} /> Edit ticket
              </Button>
              <Button kind="danger-secondary" onClick={deleteTicket}>
                <FontAwesomeIcon icon={faTrash} /> Delete ticket
              </Button>
              {user.roles.includes("SUPPORT_AGENT") &&
                ticket?.body?.ticketstatus === "open" && (
                  <Button kind="primary" onClick={resolveTicket}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Resolve ticket
                  </Button>
                )}
            </div>
          </div>
          <div className="container">{ticket?.body?.content}</div>
        </div>
      </div>
    </>
  )
}
