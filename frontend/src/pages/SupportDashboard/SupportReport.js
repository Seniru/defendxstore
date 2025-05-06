import { useMemo, useState } from "react"
import useFetch from "../../hooks/useFetch"
import Table from "../../components/Table"
import Input from "../../components/Input"
import Select from "../../components/Select"
import ProfileImage from "../../components/ProfileImage"
import Button from "../../components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import { saveAs } from "file-saver"
import { useAuth } from "../../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env
const now = Date.now()

const actionColors = {
  "create-ticket": "#2ecc71", // Green
  "delete-ticket": "#e74c3c", // Red
  "resolve-ticket": "#f39c12", // Orange
  "edit-ticket": "#3498db", // Blue
}

const actionMessages = {
  "create-ticket": ({ actionUser, ticketId }) => (
    <>
      <b>{actionUser}</b> created ticket <b>#{ticketId}</b>
    </>
  ),
  "delete-ticket": ({ actionUser, ticketId }) => (
    <>
      <b>{actionUser}</b> deleted ticket <b>#{ticketId}</b>
    </>
  ),
  "resolve-ticket": ({ actionUser, ticketId }) => (
    <>
      <b>{actionUser}</b> resolved ticket <b>#{ticketId}</b>
    </>
  ),
  "edit-ticket": ({ actionUser, ticketId }) => (
    <>
      <b>{actionUser}</b> edited ticket <b>#{ticketId}</b>
    </>
  ),
}

function OrderLog({ row }) {
  return (
    <tr>
      <td>{row.timestamp}</td>
      <td>
        <ProfileImage username={row.user?.username || "!"} size={35} />
      </td>
      <td>
        <span
          className="action"
          style={{
            backgroundColor: actionColors[row.action] || "#cccccc",
          }}
        >
          {row.action}
        </span>
      </td>
      <td>
        {actionMessages[row.action]
          ? actionMessages[row.action]({
              actionUser: row.user?.username || "Deleted account",
              ...row.data,
            })
          : Object.entries(row.action)}
      </td>
    </tr>
  )
}
export default function SupportReport() {
  const { token } = useAuth()
  const [username, setUsername] = useState("")
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [action, setAction] = useState(null)
  const [searchNextUpdate, setSearchNextUpdate] = useState(now)
  const queryParams = useMemo(() => {
    const params = {}
    if (username) params.searchUser = username
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    if (action) params.action = action
    return params
  }, [username, fromDate, toDate, action])

  const [logs] = useFetch(
    `${REACT_APP_API_URL}/api/reports/support?` +
      new URLSearchParams(queryParams).toString(),
  )

  const changeAction = (evt) => {
    if (evt.target.value == "All") return setAction(null)
    setAction(evt.target.value)
  }

  const handleSearchChange = (evt) => {
    setSearchNextUpdate((prev) => {
      const nextUpdate = prev + 500
      setTimeout(() => {
        // if it has taken at least 400ms since the input start
        if (nextUpdate <= Date.now()) setUsername(evt.target.value)
      }, 500)
      return nextUpdate
    })
  }

  const exportToExcel = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/reports/support?downloadSheet=true`,
        {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: "Bearer " + token,
          },
        },
      )

      const blob = await response.blob()
      saveAs(
        blob,
        `Support-Logs-Report-${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      )
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  return (
    <div className="content">
      <Button kind="secondary" onClick={exportToExcel}>
        <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
      </Button>
      <hr />

      <div className="logs-parameters">
        <div className="logs-parameter">
          <span>
            <b>User</b>
          </span>
          <Input
            type="text"
            placeholder="Search user by name"
            onChange={handleSearchChange}
          />
        </div>
        <div className="logs-parameter">
          <span>
            <b>Action</b>
          </span>
          <Select
            items={["All", ...(logs?.body?.actions || [])]}
            onChange={changeAction}
          />
        </div>
        <div className="logs-parameter">
          <span>
            <b>Date</b>
          </span>
          <div>
            From
            <Input
              type="date"
              onChange={(evt) => setFromDate(evt.target.value)}
            />
            To
            <Input
              type="date"
              onChange={(evt) => setToDate(evt.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="logs-table">
        <Table
          headers={["Timestamp", "User", "Action", "Log"]}
          rows={logs?.body?.report || []}
          renderRowWith={OrderLog}
        />
      </div>
    </div>
  )
}
