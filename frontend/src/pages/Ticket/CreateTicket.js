import { useRef } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"

export default function CreateTicket() {
  const titleRef = useRef()
  const contentRef = useRef()
  const typeRef = useRef()
  const { token } = useAuth()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    api.post(
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
    <form onSubmit={handleSubmit}>
      <div className="content">
        <div className="title">Title</div>
        <Input
          type="text"
          placeholder="Enter title"
          ref={titleRef}
          minLength={10}
          required
        />{" "}
        <br />
      </div>
      Ticket Type
      <Select
        items={{
          inquiry: "Inquiry",
          payment: "Payment",
          return: "Return Order",
          complaints: "Complaints",
        }}
        ref={typeRef}
      />{" "}
      <br />
      Ticket content
      <textarea minLength={10} ref={contentRef}></textarea>
      <br />
      <Button kind="primary">Submit</Button>
    </form>
  )
}
