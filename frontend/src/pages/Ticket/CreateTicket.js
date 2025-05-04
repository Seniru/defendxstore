import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import "./CreateTicket.css"
import CreateTicketForm from "../../forms/CreateTicketForm"
export default function CreateTicket() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (evt, titleRef, typeRef, contentRef) => {
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
      <CreateTicketForm handleSubmit={handleSubmit} />
    </div>
  )
}
