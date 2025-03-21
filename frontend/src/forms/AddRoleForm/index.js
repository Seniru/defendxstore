import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Select from "../../components/Select"
import Button from "../../components/Button"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import { useRef } from "react"

export default function AddRoleForm({
  username,
  setIsError,
  setMessage,
  setIsOpen,
  refreshFlag,
  setRefreshFlag,
}) {
  const { token } = useAuth()
  const selectRef = useRef()

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const response = await api.post(
      `/api/users/${username}/role`,
      { role: selectRef.current.value },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setIsOpen(!response.ok)
    setMessage(result.body)
    setRefreshFlag(!refreshFlag)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a new role</h3>
      <p className="secondary-text">
        Please select a role from the list below.
      </p>
      <hr />
      <p className="secondary-text">
        <FontAwesomeIcon icon={faInfoCircle} /> User name: {username}
      </p>
      <label>Role</label>
      <Select
        ref={selectRef}
        items={{
          USER: "User",
          SUPPORT_AGENT: "Support Agent",
          DELIVERY_AGENT: "Delivery Agent",
          ADMIN: "Admin",
        }}
      />
      <Button kind="primary" type="submit">
        Submit
      </Button>
    </form>
  )
}
