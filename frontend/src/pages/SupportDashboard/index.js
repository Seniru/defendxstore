import { useState } from "react"
import { useAuth } from "../../contexts/AuthProvider"
import useFetch from "../../hooks/useFetch"
import TabMenu from "../../components/TabMenu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderClosed, faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import ProfileImage from "../../components/ProfileImage"
import TabItem from "../../components/TabMenu/TabItem"

import "./SupportDashboard.css"
import TicketView from "./TicketView"

const { REACT_APP_API_URL } = process.env

export default function SupportDashboard() {
  const { user } = useAuth()
  const [refreshTickets, setRefreshTickets] = useState(false)
  const [openTickets] = useFetch(
    `${REACT_APP_API_URL}/api/tickets?status=open`,
    {
      body: [],
    },
    refreshTickets,
  )
  const [closedTickets] = useFetch(
    `${REACT_APP_API_URL}/api/tickets?status=closed`,
    {
      body: [],
    },
    refreshTickets,
  )

  return (
    <div className="support-dashboard-main">
      <aside className="profile-details">
        <div className="profile-image-containter">
          <ProfileImage username={user.username} size={100} />
        </div>
        <br />
        Welcome,
        <br />
        <b className="username">{user.username}</b>
        <hr />
        <br />
        <div className="profile-title">
          <FontAwesomeIcon icon={faFolderOpen} /> Open tickets
        </div>
        {openTickets?.body?.length}
        <br />
        <br />
        <div className="profile-title">
          <FontAwesomeIcon icon={faFolderClosed} /> Closed tickets
        </div>
        {closedTickets?.body?.length}
      </aside>
      <div className="dashboard-content">
        <TabMenu>
          <TabItem
            name="Tickets"
            element={
              <TicketView
                refreshTickets={refreshTickets}
                setRefreshTickets={setRefreshTickets}
              />
            }
          />
          <TabItem name="Report" element={<div />} />
        </TabMenu>
      </div>
    </div>
  )
}
