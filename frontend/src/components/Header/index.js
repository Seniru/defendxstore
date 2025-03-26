import { Link, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAt,
  faCaretDown,
  faCaretUp,
  faCartShopping,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"

import SearchBar from "../SearchBar"
import Button from "../Button"
import "./Header.css"
import { useAuth } from "../../contexts/AuthProvider"
import ProfileImage from "../ProfileImage"
import Role from "../Role"
import { useEffect, useState } from "react"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"

export default function Header() {
  const { user, logoutAction } = useAuth()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false)
  const [touchingMainDropDown, setTouchingMainDropDown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setProfileDropdownOpen(false)
  }, [location])

  return (
    <>
      <header>
        <div className="header-logo">
          <Link to="/" className="no-highlight">
            DefendX
          </Link>
        </div>
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
            <li
              onMouseEnter={() => setMainDropdownOpen(true)}
              onMouseLeave={() => setTimeout(setMainDropdownOpen, 500, false)}
            >
              MORE <FontAwesomeIcon icon={faChevronDown} />
            </li>
          </ul>
        </nav>
        <div className="header-searchbar">
          <SearchBar placeholder="Search items..." width={300} />
        </div>
        {user ? (
          <div className="header-user-information">
            <Link to="/cart" className="no-highlight">
              <FontAwesomeIcon icon={faCartShopping} size="lg" />
            </Link>
            <Button
              kind="secondary"
              className="logout-button"
              onClick={logoutAction}
            >
              Logout
            </Button>
            <ProfileImage username={user.username} size={30} />{" "}
            <FontAwesomeIcon
              icon={profileDropdownOpen ? faCaretUp : faCaretDown}
              cursor="pointer"
              style={{ marginLeft: 5 }}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            />
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
      {profileDropdownOpen && (
        <div className="container profile-dropdown">
          <h3>DefendX</h3>
          <div class="profile-information">
            <div>
              <ProfileImage username={user.username} size={75} />
            </div>
            <div>
              <b>
                {user.username}
                {user.roles.map((role) => (
                  <Role role={role} includeOptions={false} />
                ))}
              </b>
              <br />
              <br />
              <span>
                <FontAwesomeIcon icon={faAt} /> {user.email}
              </span>
              <br />
            </div>
          </div>
          <ul className="links">
            <li>
              <Link to="/profile">My profile</Link>
            </li>
            {user.roles.includes("ADMIN") && (
              <li>
                <Link to="/admin">Admin dashboard</Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <div
        className={`container main-dropdown ${mainDropdownOpen || touchingMainDropDown ? "open" : ""}`}
        onMouseEnter={() => {
          setMainDropdownOpen(true)
          setTouchingMainDropDown(true)
        }}
        onMouseLeave={() => {
          setMainDropdownOpen(false)
          setTouchingMainDropDown(false)
        }}
      >
        <div>
          <h2>My account</h2>
          <ul>
            <li>
              <Link to="profile">View my profile</Link>
            </li>
            <li>
              <Link to="cart">View cart</Link>
            </li>
            {user.roles.includes("ADMIN") && (
              <li>
                <Link to="admin">Admin dashboard</Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2>Support</h2>
          <ul>
            <li>
              <Link to="support">My tickets</Link>
            </li>
            <li>
              <Link to="forum">Community</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Information</h2>
          <ul>
            <li>About us</li>
            <li>FAQ</li>
            <li>Privacy policy</li>
            <li>
              <FontAwesomeIcon icon={faInstagram} size="lg" />{" "}
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
