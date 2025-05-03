import { useRef } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import "./CreateTicket.css"
export default function CreateTicket() {
  const titleRef = useRef()
  const contentRef = useRef()
  const typeRef = useRef()
  const { token } = useAuth()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    await api.post(
      "/api/tickets",
      {
        title: titleRef.current.value,
        content: contentRef.current.value,
        type: typeRef.current.value,
      },
      token,
    )
  }

  return (
    <div className="create-ticket-container">
      <h2>Create New Ticket</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="content">
          <div className="title">Title</div>
          <Input
            type="text"
            placeholder="Enter title"
            ref={titleRef}
            minLength={10}
            required
          />{" "}
        </div>

        <div className="ticket_type">
          Ticket Type
          <br />
          <Select
            id="ticket-type"
            items={{
              inquiry: "Inquiry",
              payment: "Payment",
              return: "Return Order",
              complaints: "Complaints",
            }}
            ref={typeRef}
          />{" "}
          <br />
        </div>
        <br />

        <div className="ticket_content">
          <label className="ticket_content_name">Ticket content</label>
          <br />
          <textarea
            minLength={10}
            ref={contentRef}
            id="ticket-content_box"
            place
            holder="Describr your issue in detail..."
          ></textarea>
          <br />
        </div>

        <div className="Button_newticket">
          <Button kind="primary" className="button_primary">
            Submit
          </Button>
          <button kind="secondary" className="button_secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
