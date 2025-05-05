import { useAuth } from "../../contexts/AuthProvider"
import ChangePasswordForm from "../../forms/ChangePasswordForm"
import Forbidden from "../errors/Forbidden"

import "./ResetPassword.css"

export default function ResetPassword() {
  const { user } = useAuth()
  if (user) return <Forbidden />

  return (
    <div className="reset-password content container">
      <ChangePasswordForm />
    </div>
  )
}
