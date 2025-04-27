import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

import "./Footer.css"

export default function Footer() {
  return (
    <footer>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} defendxstore.com
      </div>
      <nav>
        <ul>
          <li>About us</li>
          <li><Link to="/faq">FAQ</Link></li>
          <li>Privacy Policy</li>
        </ul>
      </nav>
      <div className="footer-socials">
        <span>
          support@defendxstore.com
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <FontAwesomeIcon icon={faInstagram} />
        <FontAwesomeIcon icon={faFacebook} />
      </div>
    </footer>
  )
}
