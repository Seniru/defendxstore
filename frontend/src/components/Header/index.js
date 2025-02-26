import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartShopping,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

import SearchBar from "../SearchBar"
import Button from "../Button"
import "./Header.css"
import { useAuth } from "../../contexts/AuthProvider"
import ProfileImage from "../ProfileImage"

export default function Header() {
  const { user, logoutAction } = useAuth()
  const navigate = useNavigate()

  return (
    <header>
      <div className="header-logo">DefendX</div>
      <nav>
        <ul>
          <li>
            MEN <FontAwesomeIcon icon={faChevronDown} />
          </li>
          <li>
            WOMEN <FontAwesomeIcon icon={faChevronDown} />
          </li>
          <li>
            ACCESSORIES <FontAwesomeIcon icon={faChevronDown} />
          </li>
          <li>
            MORE <FontAwesomeIcon icon={faChevronDown} />
          </li>
        </ul>
      </nav>
      <div className="header-searchbar">
        <SearchBar placeholder="Search items..." width={300} />
      </div>
      {user ? (
        <div className="header-user-information">
          <FontAwesomeIcon icon={faCartShopping} size="lg" />
          <Button
            kind="secondary"
            className="logout-button"
            onClick={logoutAction}
          >
            Logout
          </Button>
          <ProfileImage username={user.username} size={30} />
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      ) : (
        <div className="header-user-sign">
          <Button
            kind="secondary"
            className="logout-button"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </Button>
          <Button
            kind="secondary"
            className="logout-button"
            onClick={() => navigate("/auth/signup")}
          >
            Signup
          </Button>
        </div>
      )}
    </header>
  )
}
