import { useSearchParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthProvider"
import api from "../../utils/api"
import Error from "../errors/Error"
import VerificationAnimation from "./VerificationAnimation"

import "./Verify.css"
import { useEffect, useState } from "react"

export default function Verify() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const verifyToken = searchParams.get("token")

  useEffect(() => {
    if (mounted) return
    setMounted(true)

    const verify = async () => {
      try {
        const response = await api.put(
          `/api/auth/verify?token=${verifyToken}`,
          {},
          token,
        )
        setIsSuccess(response.ok)
      } catch (error) {
        console.error("Verification failed:", error)
        setIsSuccess(false)
      }
    }

    verify()
  }, [mounted, token, verifyToken])

  return (
    <div className="verification-container content">
      {isSuccess ? (
        <>
          <h1>You're Good to Go!</h1>
          <p className="secondary-text">
            Email confirmed. Your email is verified. Here's what you unlock with
            a verified account{" "}
          </p>
          <ul>
            <li>Recover your account with ease</li>
            <li>Get access to exclusive discounts</li>
            <li>Stay updated with order and delivery notifications</li>
            <li>...and more perks tailored for you</li>
          </ul>

          <VerificationAnimation />
        </>
      ) : (
        <>
          <h1>Hmm... That Didn’t Work</h1>
          <p className="secondary-text">
            The link may have expired or is invalid. Try verifying again?
          </p>
          <Error />
        </>
      )}
    </div>
  )
}
