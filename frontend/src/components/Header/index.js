import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartShopping,
  faChevronDown,
  faChevronRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

import SearchBar from "../SearchBar"
import Button from "../Button"
import "./Header.css"

export default function Header() {
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
      <div className="header-user-information">
        <FontAwesomeIcon icon={faCartShopping} size="lg" />
        <Button kind="secondary" className="logout-button">
          Logout
        </Button>
        <span className="header-profile-image">
          <FontAwesomeIcon icon={faUser} size="lg" />
        </span>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </header>
  )
}
