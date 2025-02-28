import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import "./UserManagement.css"
import {
  faAddressCard,
  faAt,
  faPencil,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

const users = [
  {
    id: 1,
    username: "user1",
    email: "user1@gmail.com",
    roles: ["USER"],
  },
  {
    id: 2,
    username: "user2",
    email: "user2@gmail.com",
    deliveryAddress: "ABC/12, Somewhere street, Colombo",
    contactNumbers: ["011-23456800", "011-9999999"],
    roles: ["USER", "SUPPORT_AGENT"],
  },
  {
    id: 3,
    username: "user3",
    email: "user3@gmail.com",
    contactNumbers: ["011-23456800", "011-9999999"],
    roles: ["USER", "DELIVERY_AGENT"],
  },
  {
    id: 4,
    username: "user4",
    email: "user4@gmail.com",
    contactNumbers: ["011-23456800", "011-9999999"],
    roles: ["USER", "SUPPORT_AGENT", "ADMIN"],
  },
  {
    id: 5,
    username: "user5",
    email: "user5@gmail.com",
    roles: ["USER"],
  },
  {
    id: 6,
    username: "user6",
    email: "user6@gmail.com",
    deliveryAddress: "ABC/12, Somewhere street, Colombo",
    contactNumbers: ["011-2345680"],
    roles: ["USER", "SUPPORT_AGENT"],
  },
  {
    id: 7,
    username: "user7",
    email: "user7@gmail.com",
    deliveryAddress: "ABC/12, Somewhere street, Colombo",
    contactNumbers: ["011-2345680"],
    roles: ["USER", "DELIVERY_AGENT"],
  },
  {
    id: 8,
    username: "user8",
    email: "user8@gmail.com",
    roles: ["USER", "ADMIN"],
  },
  {
    id: 9,
    username: "user9",
    email: "user9@gmail.com",
    roles: ["USER"],
  },
  {
    id: 10,
    username: "user10",
    email: "user10@gmail.com",
    roles: ["USER", "SUPPORT_AGENT"],
  },
  {
    id: 11,
    username: "user11",
    email: "user11@gmail.com",
    roles: ["USER", "DELIVERY_AGENT"],
  },
  {
    id: 12,
    username: "user12",
    email: "user12@gmail.com",
    roles: ["USER", "ADMIN"],
  },
]

// user details component
function UserDetails({
  id,
  username,
  email,
  deliveryAddress,
  contactNumbers,
  roles,
  keyProp,
}) {
  return (
    <div className="container user-details-container" key={keyProp}>
      <div className="user-details">
        <ProfileImage username={username} size={50} />
        <div className="user-details-text">
          <div>
            <span className="username">{username}</span>
            {roles.map((role) => {
              const style = {
                USER: { backgroundColor: "#007BFF", color: "#FFFFFF" },
                SUPPORT_AGENT: { backgroundColor: "#FFC107", color: "#000000" },
                DELIVERY_AGENT: {
                  backgroundColor: "#28A745",
                  color: "#FFFFFF",
                },
                ADMIN: { backgroundColor: "#DC3545", color: "#FFFFFF" },
              }[role]

              let cleanRoleName = {
                USER: "User",
                SUPPORT_AGENT: "Support Agent",
                DELIVERY_AGENT: "Delivery Agent",
                ADMIN: "Admin",
              }[role]

              return (
                <div className="role" style={style}>
                  {cleanRoleName}
                </div>
              )
            })}
          </div>
          <div>
            <div className="secondary-text">
              <FontAwesomeIcon icon={faAt} size="sm" /> {email}
            </div>
            <br />
            {contactNumbers && (
              <div>
                {contactNumbers.map((contactNumber, index) => (
                  <div key={index}>
                    <FontAwesomeIcon icon={faPhone} size="sm" /> {contactNumber}
                  </div>
                ))}
              </div>
            )}
            {deliveryAddress && (
              <div>
                <FontAwesomeIcon icon={faAddressCard} size="sm" />{" "}
                {deliveryAddress}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <FontAwesomeIcon icon={faPencil} />{" "}
        <FontAwesomeIcon icon={faTrash} color="red" />
      </div>
    </div>
  )
}

export default function UserManagement() {
  return (
    <div className="content">
      <div className="user-management-actions">
        <SearchBar placeholder={"Search users"} />
        <Select items={["User", "Support agent", "Delivery agent", "Admin"]} />
      </div>
      <div className="secondary-text">Showing 999 users...</div>
      {users.map((user, index) => (
        <UserDetails
          id={user.id}
          username={user.username}
          email={user.email}
          deliveryAddress={user.deliveryAddress}
          contactNumbers={user.contactNumbers}
          roles={user.roles}
          keyProp={index}
        />
      ))}
    </div>
  )
}
