import { useEffect, useRef, useState } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import TextEditor from "../../components/TextEditor"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import Markdown from "react-markdown"
import { useNavigate, useSearchParams } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
import Forbidden from "../errors/Forbidden"

const { REACT_APP_API_URL } = process.env

export default function CreateForum() {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [content, setContent] = useState("")
  const titleRef = useRef()
  const contentRef = useRef()
  const categoryRef = useRef()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")
  const [thread] = useFetch(`${REACT_APP_API_URL}/api/forums/${id}`)
  const isEditting = thread?.body?._id === id

  useEffect(() => {
    if (!isEditting) return
    titleRef.current.value = thread?.body?.title
    categoryRef.current.value = thread?.body?.category
    setContent(thread?.body?.content)
  }, [id, thread, isEditting])

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    if (isEditting) {
      const response = await api.put(
        `/api/forums/${id}`,
        {
          title: titleRef.current.value,
          content: content,
          category: categoryRef.current.value,
        },
        token,
      )

      if (response.ok) navigate(`/forum/thread?id=${id}`)
    } else {
      const response = await api.post(
        "/api/forums",
        {
          title: titleRef.current.value,
          content: content,
          category: categoryRef.current.value,
        },
        token,
      )

      if (response.ok) {
        const result = await response.json()
        navigate(`/forum/thread?id=${result?.body?._id}`)
      }
    }
  }

  if (
    thread?.body?.createdUser &&
    thread.body.createdUser.username !== user.username
  )
    return <Forbidden />

  return (
    <form onSubmit={handleSubmit}>
      <div className="content">
        <h3>{isEditting ? "Edit thread" : "Create a new thread"}</h3>
        <hr />
        <br />
        <div>
          <b>Title</b>
        </div>
        <Input
          type="text"
          placeholder="Enter title"
          ref={titleRef}
          width={300}
          minLength={10}
          required
        />{" "}
        <br />
        <div>
          <b>Category</b>
        </div>
        <Select
          items={{
            suggestion: "Suggestion",
            tip: "Tip",
            question: " Questions",
            discussion: "Discussion",
            other: "Other",
          }}
          ref={categoryRef}
        />{" "}
        <br />
        <br />
        <div>
          <b>Content</b>
        </div>
        <TextEditor
          rows={8}
          cols={150}
          setText={setContent}
          text={content}
          extraTools={
            <Button
              kind="secondary"
              type="button"
              onClick={() => setIsPreviewing(!isPreviewing)}
            >
              {isPreviewing ? "Hide Preview" : "Show Preview"}
            </Button>
          }
          onChange={(evt) => setContent(evt.target.value)}
          required
        />
        <br />
        <Button kind="primary">Submit</Button>
        {isPreviewing && (
          <>
            <h3>Preview</h3>
            <hr />
            <div className="container">
              {content.length == 0 ? (
                <p className="secondary-text">Nothing to preview...</p>
              ) : (
                <Markdown>{content}</Markdown>
              )}
            </div>
          </>
        )}
      </div>
    </form>
  )
}
