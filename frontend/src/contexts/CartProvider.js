import { createContext, useContext, useState } from "react"
import { useAuth } from "./AuthProvider"
import useFetch from "../hooks/useFetch"

const CartContext = createContext()

const { REACT_APP_API_URL } = process.env

export const CartProvider = function ({ children }) {
  const [refreshCart, setRefreshCart] = useState(false)
  const { user } = useAuth()

  const [items] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user?.username}/cart`,
    { body: [] },
    refreshCart,
  )

  return (
    <CartContext.Provider
      value={{
        items,
        refreshCart,
        setRefreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  return useContext(CartContext)
}
