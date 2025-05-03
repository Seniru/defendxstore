import { useRef } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Select from "../../components/Select"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"

export default function CreateForum() {
  const titleRef = useRef()
  const contentRef = useRef()
  const categoryRef = useRef()
  const { token } = useAuth()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    api.post(
      "/api/Forums",

      {
        title: titleRef.current.value,
        content: contentRef.current.value,
        category: categoryRef.current.value,
      },
      token,
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="content">
        <div className="title">Title</div>
        <Input
          type="text"
          placeholder="Enter title"
          ref={titleRef}
          minLength={10}
          required
        />{" "}
        <br />
      </div>
      category
      <Select
        items={{
          suggessions: "Suggessions",
          tips: "Tips",
          questions: " Questions",
          other: "Others",
        }}
        ref={categoryRef}
      />{" "}
      <br />
      Forum content
      <textarea minLength={10} ref={contentRef}></textarea>
      <br />
      <Button kind="primary">Submit</Button>
    </form>
  )
}
