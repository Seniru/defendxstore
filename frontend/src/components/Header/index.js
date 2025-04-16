import { Link, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAt,
  faBell,
  faCaretDown,
  faCaretUp,
  faCartShopping,
  faCheck,
  faChevronDown,
  faCircleCheck,
  faClipboard,
  faInfoCircle,
  faLink,
} from "@fortawesome/free-solid-svg-icons"

import SearchBar from "../SearchBar"
import Button from "../Button"
import "./Header.css"
import { useAuth } from "../../contexts/AuthProvider"
import ProfileImage from "../ProfileImage"
import Role from "../Role"
import { Fragment, useEffect, useState } from "react"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import useFetch from "../../hooks/useFetch"
import { useCart } from "../../contexts/CartProvider"
import Menu from "../Menu"
import Notification from "./Notification"
import api from "../../utils/api"

const { REACT_APP_API_URL } = process.env

export default function Header() {
  const { user, logoutAction, token } = useAuth()
  const { refreshCart } = useCart()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false)
  const [touchingMainDropDown, setTouchingMainDropDown] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [refreshNotifications, setRefreshNotifications] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItems] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user?.username}/cart`,
    { body: { totalItems: 0 } },
    refreshCart,
  )
  const [notifications] = useFetch(
    `${REACT_APP_API_URL}/api/notifications`,
    {},
    refreshNotifications,
  )

  const [profileData] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user?.username}`,
  )

  useEffect(() => {
    setProfileDropdownOpen(false)
  }, [location])

  const clearNotifications = async () => {
    await api.delete("/api/notifications", {}, token)
    setRefreshNotifications(!refreshNotifications)
  }

  const copyreferral = async () => {
    await navigator.clipboard.writeText(profileData?.body?.user?.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3500)
  }

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
              {cartItems?.body?.totalItems > 0 && (
                <span className="count-indicator">
                  {cartItems?.body?.totalItems}
                </span>
              )}
            </Link>
            <div
              style={{ marginLeft: 20, marginRight: 15, cursor: "pointer" }}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <FontAwesomeIcon icon={faBell} size="lg" />
              {notifications?.body?.notificationCount > 0 && (
                <span className="count-indicator">
                  {notifications?.body?.notificationCount}
                </span>
              )}
            </div>
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
          <div class="profile-information container">
            <div>
              <ProfileImage username={user.username} size={75} />
            </div>
            <div>
              <b>
                {user?.username}{" "}
                {profileData?.body?.user?.verified && (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    title="Email verified"
                    cursor="pointer"
                    color="var(--secondary-text-color)"
                  />
                )}{" "}
                {user?.roles &&
                  user.roles.map((role) => (
                    <Role role={role} includeOptions={false} />
                  ))}
              </b>
              <br />
              <br />
              <div>
                <FontAwesomeIcon icon={faAt} /> {user.email}
              </div>
              <br />
              {profileData?.body?.user?.referralLink && (
                <div>
                  <div>
                    <FontAwesomeIcon icon={faLink} size="sm" /> Referral link{" "}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size="sm"
                      cursor="pointer"
                      title="Share this code with your friends to earn exclusive benefits"
                    />
                  </div>
                  <span className="secondary-text">
                    {profileData?.body?.user?.referralLink}
                  </span>
                  <Button kind="secondary" onClick={copyreferral}>
                    {copied ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} /> Copied
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faClipboard} /> Copy
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <ul className="links container">
            <li>
              <Link to="/profile">My profile</Link>
            </li>
            {user?.roles.includes("ADMIN") && (
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
            {user?.roles.includes("ADMIN") && (
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
      {isNotificationsOpen && (
        <div className="container notification-menu">
          <div className="header">
            <h3>
              <FontAwesomeIcon icon={faBell} /> Notification center
            </h3>
            <Button kind="secondary" onClick={clearNotifications}>
              Clear all
            </Button>
          </div>
          <hr />
          {notifications?.body?.notifications.length == 0 ? (
            <span className="secondary-text">
              You are all caught up! No notifications to display
            </span>
          ) : (
            notifications?.body?.notifications.map((notification, index) => (
              <>
                <Notification
                  notification={notification.message}
                  time={notification.date}
                  index={index}
                  refreshNotifications={refreshNotifications}
                  setRefreshNotifications={setRefreshNotifications}
                />
                <hr />
              </>
            ))
          )}
        </div>
      )}
    </>
  )
}
