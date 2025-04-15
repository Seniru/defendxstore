import VerificationAnimation from "./VerificationAnimation"

import "./Verify.css"

export default function Verify() {
  return (
    <div className="verification-container content">
      <h1>You're Good to Go!</h1>
      <p className="secondary-text">
        Email confirmed. Your email is verified. Here's what you unlock with a
        verified account{" "}
      </p>
      <ul>
        <li>Recover your account with ease</li>
        <li>Get access to exclusive discounts</li>
        <li>Stay updated with order and delivery notifications</li>
        <li>...and more perks tailored for you</li>
      </ul>

      <VerificationAnimation />
    </div>
  )
}
