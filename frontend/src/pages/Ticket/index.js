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
import { useSearchParams } from "react-router-dom"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function Ticket() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")

  const [ticket, loading, error] = useFetch(
    `${REACT_APP_API_URL}/api/tickets/${id}`,
    {
      body: [],
    },
  )

  if (loading) return <div className="content"> Loading...</div>
  if (error) return <div className="content"> Error: {error.message}</div>
  if (!ticket) return <div className="content"> Ticket not found</div>

  const formattedDate = ticket.body?.date
    ? new Date(ticket.body?.date).toLocaleString()
    : "No date"

  return (
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
            <Button kind="secondary">
              <FontAwesomeIcon icon={faPencil} /> Edit ticket
            </Button>
            <Button kind="danger-secondary">
              <FontAwesomeIcon icon={faTrash} /> Delete ticket
            </Button>
            <Button kind="primary">
              <FontAwesomeIcon icon={faCheckCircle} /> Resolve ticket
            </Button>
          </div>
        </div>
        <div className="container">{ticket?.body?.content}</div>
      </div>
    </div>
  )
}
