import useFetch from "../../../hooks/useFetch"
import SearchBar from "../../../components/SearchBar"
import Select from "../../../components/Select"
import UserDetails from "./UserDetails"
import { useEffect, useMemo, useState } from "react"

import "./UserManagement.css"
import MessageBox from "../../../components/MessageBox"

const { REACT_APP_API_URL } = process.env
const now = Date.now()

export default function UserManagement() {
  const [refreshFlag, setRefreshFlag] = useState(true)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("ALL")
  const [searchNextUpdate, setSearchNextUpdate] = useState(now)
  const queryParams = useMemo(() => {
    let params = { search }
    if (category !== "ALL") params.type = category
    return new URLSearchParams(params).toString()
  }, [search, category])
  const [usersResponse] = useFetch(
    `${REACT_APP_API_URL}/api/users?${queryParams}`,
    [],
    refreshFlag,
  )

  useEffect(() => {
    if (usersResponse.success && usersResponse.body)
      setUsers(usersResponse.body.users)
  }, [usersResponse])

  const handleSearchChange = (evt) => {
    setSearchNextUpdate(searchNextUpdate + 500)
    setTimeout(() => {
      // if it has taken atleast 400ms since the input start
      if (searchNextUpdate <= Date.now()) setSearch(evt.target.value)
    }, 500)
  }

  return (
    <div className="content">
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <div className="user-management-actions">
        <SearchBar placeholder={"Search users"} onChange={handleSearchChange} />
        <Select
          items={{
            ALL: "All",
            USER: "Users",
            DELIVERY_AGENT: "Delivery Agents",
            SUPPORT_AGENT: "Support Agents",
            ADMIN: "Administrators",
          }}
          onChange={(evt) => setCategory(evt.target.value)}
        />
      </div>
      <div className="secondary-text">Showing {users.length} users...</div>
      {users &&
        users.map((user, index) => (
          <UserDetails
            id={user.id}
            username={user.username}
            email={user.email}
            deliveryAddress={user.deliveryAddress}
            contactNumbers={user.contactNumber}
            roles={user.role}
            verified={user.verified}
            keyProp={index}
            setIsError={setIsError}
            setMessage={setMessage}
            refreshFlag={refreshFlag}
            setRefreshFlag={setRefreshFlag}
          />
        ))}
    </div>
  )
}
