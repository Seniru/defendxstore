import { useRef } from "react"
import { useNavigate } from "react-router-dom"
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
  const navigate = useNavigate()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const response = await api.post(
      "/api/tickets",
      {
        title: titleRef.current.value,
        content: contentRef.current.value,
        type: typeRef.current.value,
      },
      token,
    )

    if (response.ok) {
      const result = await response.json()
      navigate(`/ticket?id=${result?.body?._id}`)
    }
  }

  return (
    <div className="container create-ticket-container">
      <h2>Create New Ticket</h2>

      <form onSubmit={handleSubmit} className="form">
        <div>
          <div className="title">Title</div>
          <Input
            type="text"
            placeholder="Enter title"
            ref={titleRef}
            minLength={10}
            required
          />{" "}
        </div>
        <br />

        <div>
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

        <div>
          <label className="ticket_content_name">Content</label>
          <br />
          <br />
          <textarea
            minLength={10}
            ref={contentRef}
            rows={8}
            cols={100}
            id="ticket-content_box"
            placeholder="Describe your issue in detail..."
          ></textarea>
          <br />
        </div>
        <br />

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
