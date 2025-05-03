import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import useFetch from "../../hooks/useFetch"
import "./ForumThread.css"

function ForumThreadReply({ username, createdDate, content }) {
  return (
    <div className="container thread-reply-container">
      <div>
        <ProfileImage username="User" size={50} />
        {username}
        <div className="secondary-text">{createdDate}</div>
      </div>
      <p>{content}</p>
    </div>
  )
}

const { REACT_APP_API_URL } = process.env

export default function ForumThread() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")
  const [replyContent, setReplyContent] = useState("")

  const [thread] = useFetch(`${REACT_APP_API_URL}/api/forums/${id}`, {
    body: [],
  })

  const [replies, refetchReplies] = useFetch(
    `${REACT_APP_API_URL}/api/forums/${id}/replies`,
    { body: [] },
  )

  const handleSubmitReply = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/forums/${id}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyContent,
            username: "currentUser",
          }),
        },
      )

      if (response.ok) {
        setReplyContent("")
        refetchReplies()
      }
    } catch (error) {
      console.error("Error submiting reply:", error)
    }
  }

  return (
    <div className="content">
      <h1>{thread?.body?.title}</h1>
      <div className="forum-thread-main-content">
        <div className="forum-thread-main-information">
          <div>
            <ProfileImage username={thread?.body?.createdUser} size={50} />
            {thread?.body?.createdUser}
            <div className="secondary-text">
              {new Date(thread?.body?.createdDate).toLocaleDateString()}{" "}
            </div>
          </div>
        </div>
        <p>{thread?.body?.content}</p>
      </div>
      <br />
      <hr />
      <h3>Replies</h3>
      {replies?.body?.length > 0 ? (
        replies.body.map((reply) => (
          <ForumThreadReply
            content={reply.content}
            username={reply.username}
            createdDate={reply.createdDate}
          />
        ))
      ) : (
        <p>No replies yet.</p>
      )}

      <hr />
      <h3>Answer</h3>
      <textarea rows={5} cols={100} value={replyContent}></textarea>
      <hr />
      <br />
      <Button kind="primary" onClick={handleSubmitReply}>
        Submit
      </Button>
    </div>
  )
}
