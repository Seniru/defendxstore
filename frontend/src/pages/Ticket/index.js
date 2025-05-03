import {
  faHeadset,
  faPen,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"

import "./Ticket.css"
import Button from "../../components/Button"
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
    ? new Date(ticket.date).toLocaleDateString()
    : "No date"

  return (
    <div className="content">
      <h1>
        {" "}
        <FontAwesomeIcon icon={faHeadset} /> Customer Support
      </h1>
      <div className="ticket-container">
        <div className="ticket-type">
          <div>
            <ProfileImage username={ticket?.username || "Unknown"} size={50} />
            {ticket?.body?.username || "Unknown User"}
          </div>
          <div>
            {ticket?.type || "No Type"} Date {formattedDate}
          </div>
        </div>

        <div>
          <div className="Edit-Delete">
            <div>
              <div>
                <h3>{ticket?.body?._id}</h3>
                <h2>{ticket?.body?.title}</h2>
              </div>
            </div>

            <div>
              <div>
                <span className="ticket?.body?.status">
                  {ticket?.body?.ticketstatus}
                </span>{" "}
                <FontAwesomeIcon icon={faPen} />{" "}
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
          <div>{ticket?.body?.content}</div>
          <div className="Button">
            <Button kind="primary">Resolve ticket</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
