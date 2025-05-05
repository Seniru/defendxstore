import { useAuth } from "../../contexts/AuthProvider"
import ForgotPasswordForm from "../../forms/ForgotPasswordForm"
import Forbidden from "../errors/Forbidden"

export default function ForgotPassword() {
  const { user } = useAuth()
  if (user) return <Forbidden />

  return (
    <div className="content">
      <ForgotPasswordForm />
    </div>
  )
}
