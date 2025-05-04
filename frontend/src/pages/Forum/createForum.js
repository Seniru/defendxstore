import { useRef, useState } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import TextEditor from "../../components/TextEditor"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import Markdown from "react-markdown"
import { useNavigate } from "react-router-dom"

export default function CreateForum() {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [content, setContent] = useState("")
  const titleRef = useRef()
  const contentRef = useRef()
  const categoryRef = useRef()
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="content">
        <h3>Create a new thread</h3>
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
                <p className="secondary-text">Nothing to preivew...</p>
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
