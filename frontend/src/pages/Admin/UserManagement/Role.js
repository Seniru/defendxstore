import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import api from "../../../utils/api"
import { useAuth } from "../../../contexts/AuthProvider"

export default function Role({
  username,
  role,
  setIsError,
  setMessage,
  refreshFlag,
  setRefreshFlag,
}) {
  const { token } = useAuth()

  const style = {
    USER: { backgroundColor: "#007BFF", color: "#FFFFFF" },
    SUPPORT_AGENT: { backgroundColor: "#FFC107", color: "#000000" },
    DELIVERY_AGENT: {
      backgroundColor: "#28A745",
      color: "#FFFFFF",
    },
    ADMIN: { backgroundColor: "#DC3545", color: "#FFFFFF" },
  }[role]

  let cleanRoleName = {
    USER: "User",
    SUPPORT_AGENT: "Support Agent",
    DELIVERY_AGENT: "Delivery Agent",
    ADMIN: "Admin",
  }[role]

  const removeRole = async () => {
    const response = await api.delete(
      `/api/users/${username}/role/${role}`,
      [],
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body)
    setRefreshFlag(!refreshFlag)
  }

  return (
    <div className="role" style={style}>
      <span>{cleanRoleName}</span>
      <FontAwesomeIcon
        icon={faX}
        color={"red"}
        size="xs"
        cursor="pointer"
        onClick={removeRole}
      />
    </div>
  )
}
