import { useRef } from "react"
import Input from "../../components/Input"
import Select from "../../components/Select"
import Button from "../../components/Button"

export default function CreateTicketForm({
  handleSubmit,
  title,
  type,
  content,
}) {
  const titleRef = useRef()
  const typeRef = useRef()
  const contentRef = useRef()

  return (
    <form
      onSubmit={(evt) => handleSubmit(evt, titleRef, typeRef, contentRef)}
      className="form"
    >
      <div>
        <div className="title">Title</div>
        <Input
          type="text"
          placeholder="Enter title"
          defaultValue={title}
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
          defaultValue={type}
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
          defaultValue={content}
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
      </div>
    </form>
  )
}
