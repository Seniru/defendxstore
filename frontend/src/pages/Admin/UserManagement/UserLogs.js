import Input from "../../../components/Input"
import ProfileImage from "../../../components/ProfileImage"
import Select from "../../../components/Select"
import Table from "../../../components/Table"
import useFetch from "../../../hooks/useFetch"
import "./UserManagement.css"

const { REACT_APP_API_URL } = process.env

const actionColors = {
  "add-role": "#27ae60",
  "remove-role": "#e74c3c",
  "edit-profile": "#3498db",
  "create-account": "#2ecc71",
  referral: "#9b59b6",
  "delete-account": "#c0392b",
  "change-password": "#f39c12",
  "change-profile-image": "#1abc9c",
  verify: "#27ae60",
  login: "#34495e",
}

const actionMessages = {
  "add-role": ({ actionUser, role, username }) => (
    <>
      <b>{actionUser}</b> added role <b>{role}</b> to <b>{username}</b>
    </>
  ),
  "remove-role": ({ actionUser, role, username }) => (
    <>
      <b>{actionUser}</b> removed role <b>{role}</b> from <b>{username}</b>
    </>
  ),
  "edit-profile": ({ actionUser }) => (
    <>
      <b>{actionUser}</b> edited their profile
    </>
  ),
  "create-account": ({ actionUser }) => (
    <>
      <b>{actionUser}</b> created an account
    </>
  ),
  referral: ({ actionUser, referredUser }) => (
    <>
      <b>{actionUser}</b> referred <b>{referredUser}</b>
    </>
  ),
  "delete-account": ({ actionUser }) => (
    <>
      <b>{actionUser}</b> deleted their account
    </>
  ),
  "change-password": ({ actionUser }) => (
    <>
      <b>{actionUser}</b> changed their password
    </>
  ),
  "change-profile-image": ({ actionUser }) => (
    <>
      <b>{actionUser}</b> changed their profile image
    </>
  ),
  verify: ({ actionUser }) => (
    <>
      <b>{actionUser}</b> verified their account
    </>
  ),
  login: ({ actionUser }) => (
    <>
      <b>{actionUser}</b> logged in
    </>
  ),
}

function UserLog({ row }) {
  return (
    <tr>
      <td>{row.timestamp}</td>
      <td>
        <ProfileImage username={row.user.username} size={35} />
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
              actionUser: row.user.username,
              ...row.data,
            })
          : Object.entries(row.action)}
      </td>
    </tr>
  )
}

export default function UserLogs({}) {
  const [logs] = useFetch(`${REACT_APP_API_URL}/api/reports/users`)

  return (
    <>
      <h3>User logs</h3>
      <hr />
      <br />
      <div className="logs-parameters">
        <div className="logs-parameter">
          <span>
            <b>User</b>
          </span>
          <Input type="text" placeholder="Search user by name" />
        </div>
        <div className="logs-parameter">
          <span>
            <b>Action</b>
          </span>
          <Select items={["Add role", "Remove role"]} />
        </div>
        <div className="logs-parameter">
          <span>
            <b>Date</b>
          </span>
          <div>
            From
            <Input type="date" />
            To
            <Input type="date" />
          </div>
        </div>
      </div>
      <div className="logs-table">
        <Table
          headers={["Timestamp", "User", "Action", "Log"]}
          rows={logs?.body?.report || []}
          renderRowWith={UserLog}
        />
      </div>
    </>
  )
}
