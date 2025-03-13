import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../../components/Button"
import api from "../../utils/api"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthProvider"

export default function DeleteAccountForm({
  setIsOpen,
  setIsError,
  setMessage,
}) {
  const { user, token, logoutAction } = useAuth()
  const navigate = useNavigate()

  const deleteAccount = async () => {
    const response = await api.delete(`/api/users/${user.username}`, {}, token)
    const result = await response.json()
    if (response.ok) {
      navigate("/")
      logoutAction()
    } else {
      setIsError(true)
      setMessage(result.body)
    }
  }

  return (
    <>
      <h3>Delete account</h3>
      <p className="secondary-text">
        <FontAwesomeIcon icon={faWarning} /> Are you sure to delete your
        account? This action is irreversible!
      </p>
      <div
        style={{
          display: "grid",
        }}
      >
        <Button kind="danger-secondary" onClick={deleteAccount}>
          Delete account
        </Button>
        <Button kind="primary" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </>
  )
}
