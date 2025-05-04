import { Link } from "react-router-dom"
import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import SearchBar from "../../components/SearchBar"
import Select from "../../components/Select"
import useFetch from "../../hooks/useFetch"
import "./Forum.css"
import { useMemo, useRef, useState } from "react"

const { REACT_APP_API_URL } = process.env

function ThreadLink({
  id,
  username,
  title,
  messageCount,
  createdDate,
  category,
}) {
  return (
    <div className="container thread-link-container">
      <div className="thread-link-main">
        <div className="thread-profile-information">
          <ProfileImage username={username} size={40} />
          <div>{username}</div>
        </div>
        <h3>
          <Link to={`thread?id=${id}`}>{title}</Link>
        </h3>
        <div className="forum-thread-category">#{category}</div>
      </div>
      <div>
        <div>{messageCount} messages</div>
        <div className="secondary-text">{createdDate.split("T")[0]}</div>
      </div>
    </div>
  )
}

export default function Forum() {
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")

  const searchRef = useRef()
  const queryParams = useMemo(() => {
    const params = {}
    if (category !== "all") params.category = category
    if (query) params.q = query
    return new URLSearchParams(params).toString()
  }, [category, query])

  const [threads] = useFetch(`${REACT_APP_API_URL}/api/forums?${queryParams}`, {
    body: [],
  })
  const data = threads?.body
  return (
    <div className="content">
      <div className="forum-actions">
        <div>
          Categories
          <Select
            items={{
              all: "All",
              suggestion: "Suggestion",
              tip: "Tip",
              question: " Questions",
              discussion: "Discussion",
              other: "Other",
            }}
            onChange={(evt) => setCategory(evt.target.value)}
          />
        </div>
        <div>
          <SearchBar placeholder="Search" ref={searchRef} />
          <Button
            kind="primary"
            onClick={() => setQuery(searchRef.current.value)}
          >
            Go
          </Button>
        </div>
      </div>
      <div className="secondary-text">Showing {data.length} threads...</div>
      <br />

      {data.map((thread) => (
        <ThreadLink
          id={thread._id}
          username={thread.createdUser?.username || ""}
          title={thread.title}
          messageCount={thread.replies.length}
          category={thread.category}
          createdDate={thread.createdDate}
        />
      ))}
      <Link to="thread/new">
        <Button className="new-thread-button">+</Button>
      </Link>
    </div>
  )
}
