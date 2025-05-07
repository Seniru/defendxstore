import { useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Markdown from "react-markdown"

import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import useFetch from "../../hooks/useFetch"
import "./ForumThread.css"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import TextEditor from "../../components/TextEditor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash, faWarning } from "@fortawesome/free-solid-svg-icons"
import OverlayWindow from "../../components/OverlayWindow"

function ForumThreadReply({ index, username, createdDate, content }) {
  return (
    <div className="container" style={{ marginTop: 10, marginBottom: 10 }}>
      <div className="thread-reply-index secondary-text">#{index + 1}</div>
      <div className="thread-reply-container">
        <div className="thread-reply-main-information">
          <ProfileImage username={username} size={50} />
          <div>{username}</div>
          <div className="secondary-text">
            <br />
            {new Date(createdDate).toLocaleDateString()}{" "}
          </div>
        </div>
        <div>
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  )
}

const { REACT_APP_API_URL } = process.env

export default function ForumThread() {
  const [searchParams] = useSearchParams()
  const { user, token } = useAuth()
  const id = searchParams.get("id")
  const [reply, setReply] = useState("")
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isDeleteThreadWindowOpen, setIsDeleteThreadWindowOpen] =
    useState(false)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const navigate = useNavigate()

  const [thread] = useFetch(
    `${REACT_APP_API_URL}/api/forums/${id}`,
    {
      body: [],
    },
    refreshFlag,
  )

  const handleSubmitReply = async (evt) => {
    evt.preventDefault()
    const response = await api.post(
      `/api/forums/${id}/replies`,
      { content: reply },
      token,
    )

    if (response.ok) {
      setReply("")
      setRefreshFlag(!refreshFlag)
    }
  }

  const deleteThread = async () => {
    const response = await api.delete(`/api/forums/${id}`, {}, token)
    if (response.ok) {
      navigate("/forum")
    }
  }

  return (
    <>
      <OverlayWindow
        isOpen={isDeleteThreadWindowOpen}
        setIsOpen={setIsDeleteThreadWindowOpen}
      >
        <h3>Delete thread</h3>
        <p className="secondary-text">
          <FontAwesomeIcon icon={faWarning} /> Are you sure to delete this
          thread? This action is irreversible!
        </p>
        <div
          style={{
            display: "grid",
          }}
        >
          <Button kind="danger-secondary" onClick={deleteThread}>
            Delete thread
          </Button>
          <Button
            kind="primary"
            onClick={() => setIsDeleteThreadWindowOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </OverlayWindow>
      <div className="forum-thread-content content">
        <div className="forum-thread-header">
          <h1>{thread?.body?.title}</h1>
          <div className="forum-thread-category">
            # {thread?.body?.category}
          </div>
        </div>
        <div className="forum-thread-main-content container">
          <div className="forum-thread-main-information">
            <ProfileImage
              username={thread?.body?.createdUser?.username || ""}
              size={50}
            />
            <div>{thread?.body?.createdUser?.username}</div>
            <div className="secondary-text">
              <br />
              {new Date(thread?.body?.createdDate).toLocaleDateString()}{" "}
            </div>
            <br />
            {user && thread?.body?.createdUser?.username === user.username && (
              <div style={{ display: "grid" }}>
                <Link to={`/forum/thread/edit?id=${thread?.body?._id}`}>
                  <Button
                    kind="secondary"
                    style={{ width: "-webkit-fill-available" }}
                  >
                    <FontAwesomeIcon icon={faPencil} cursor="pointer" /> Edit
                    thread
                  </Button>
                </Link>
                <Button
                  kind="danger"
                  onClick={() => setIsDeleteThreadWindowOpen(true)}
                >
                  <FontAwesomeIcon icon={faTrash} cursor="pointer" /> Delete
                  thread
                </Button>
              </div>
            )}
          </div>
          <div>
            <Markdown>{thread?.body?.content}</Markdown>
          </div>
        </div>
        <br />
        <h3>Replies</h3>
        {thread?.body?.replies?.length > 0 ? (
          thread?.body?.replies?.map((reply, index) => (
            <ForumThreadReply
              index={index}
              content={reply.content}
              username={reply.createdUser.username || ""}
              createdDate={reply.createdDate}
            />
          ))
        ) : (
          <p>No replies yet.</p>
        )}
        <br />
        <hr />
        <h3>Answer</h3>
        <form onSubmit={handleSubmitReply}>
          <TextEditor
            rows={8}
            cols={150}
            setText={setReply}
            text={reply}
            minLength={10}
            maxLength={2048}
            extraTools={
              <Button
                kind="secondary"
                onClick={() => setIsPreviewing(!isPreviewing)}
              >
                {isPreviewing ? "Hide Preview" : "Show Preview"}
              </Button>
            }
            required
            onChange={(evt) => setReply(evt.target.value)}
          />
          <br />
          <Button kind="primary">Submit</Button>
        </form>
        <br />
        {isPreviewing && (
          <>
            <h3>Preview</h3>
            <hr />
            <div className="container">
              {reply.length == 0 ? (
                <p className="secondary-text">Nothing to preview...</p>
              ) : (
                <Markdown>{reply}</Markdown>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
