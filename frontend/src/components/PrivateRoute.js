import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../contexts/AuthProvider"

export default function PrivateRoute({ requiredRole }) {
  let { user } = useAuth()
  if (!user) return <Navigate to="/auth/login" />

  if (user.roles.includes(requiredRole || "USER")) return <Outlet />
  return <Navigate to="/" />
}
