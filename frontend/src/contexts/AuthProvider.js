import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

import api from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  let [token, setToken] = useState(localStorage.getItem("token") || "")
  let [user, setUser] = useState(() => {
    let token = localStorage.getItem("token")
    if (token) {
      return jwtDecode(token)
    }
    return null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      setUser(jwtDecode(token))
    } else {
      localStorage.removeItem("token")
      setUser(null)
    }
  }, [token])

  const loginAction = async (data) => {
    try {
      let response = await api.post("/api/auth/login", data, token)
      let res = await response.json()
      if (response.ok) {
        if (res) setToken(res.body.token)
      } else {
        return res ? res.body : response.statusText
      }
      window.location.href = "/"
    } catch (error) {
      console.error(error)
    }
  }

  const logoutAction = () => {
    window.location.href = "/"
    setToken("")
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        loginAction,
        logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
