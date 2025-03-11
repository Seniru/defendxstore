import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import "./Forum.css"

const data = [
  {
    username: "User 1",
    title: "Title 1",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 2",
    title: "Title 2",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 3",
    title: "Title 3",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 14",
    title: "Title 4",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 15",
    title: "Title 5",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 6",
    title: "Title 6",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 7",
    title: "Title 7",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 8",
    title: "Title 8",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
  {
    username: "User 9",
    title: "Title 9",
    messageCount: 5,
    createdDate: "02/01/2023",
  },
]

function ThreadLink({ username, title, messageCount, createdDate }) {
  return (
    <div className="container thread-link-container">
      <div className="thread-link-main">
        <div>
          <ProfileImage username={username} size={40} />
          {username}
        </div>
        <h3>{title}</h3>
      </div>
      <div>
        <div>{messageCount} messages</div>
        <div>{createdDate}</div>
      </div>
    </div>
  )
}

export default function Forum() {
  return (
    <div className="content">
      <div className="forum-actions">
        <div>
          Categories
          <Select items={["All", "Suggestions", "Tips", "Insights"]} />
        </div>
        <div>
          <SearchBar placeholder="Search" />
          <Button kind="primary">Go</Button>
        </div>
      </div>
      {data.map((thread) => (
        <ThreadLink
          username={thread.username}
          title={thread.title}
          messageCount={thread.messageCount}
          createdDate={thread.createdDate}
        />
      ))}
      <Button className="new-thread-button">+</Button>
    </div>
  )
}
