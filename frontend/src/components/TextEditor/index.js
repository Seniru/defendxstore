import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
  faBold,
  faItalic,
  faCode,
  faHeading,
  faImage,
  faLink,
  faListUl,
  faListOl,
  faQuoteRight,
  faTable,
  faMinus,
} from "@fortawesome/free-solid-svg-icons"

import Button from "../Button"

export default function TextEditor({ text, setText, extraTools, ...props }) {
  const textareaRef = useRef()

  const insertAtCursor = (before, after = "") => {
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = text.slice(start, end)
    const newText =
      text.slice(0, start) + before + selected + after + text.slice(end)
    setText(newText)

    // Put cursor after inserted text
    setTimeout(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + before.length
    }, 0)
  }

  return (
    <>
      <div className="text-editor-toolbox">
        <Button
          kind="secondary"
          type="button"
          title="Bold"
          onClick={() => insertAtCursor("**", "**")}
        >
          <FontAwesomeIcon icon={faBold} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Italic"
          onClick={() => insertAtCursor("_", "_")}
        >
          <FontAwesomeIcon icon={faItalic} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Inline Code"
          onClick={() => insertAtCursor("`", "`")}
        >
          <FontAwesomeIcon icon={faCode} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Heading"
          onClick={() => insertAtCursor("### ", "")}
        >
          <FontAwesomeIcon icon={faHeading} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Image"
          onClick={() => insertAtCursor("![alt text](image-url)")}
        >
          <FontAwesomeIcon icon={faImage} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Link"
          onClick={() => insertAtCursor("[text](url)")}
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Bullet List"
          onClick={() => insertAtCursor("- item")}
        >
          <FontAwesomeIcon icon={faListUl} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Numbered List"
          onClick={() => insertAtCursor("1. item")}
        >
          <FontAwesomeIcon icon={faListOl} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Quote"
          onClick={() => insertAtCursor("> ", "")}
        >
          <FontAwesomeIcon icon={faQuoteRight} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Table"
          onClick={() =>
            insertAtCursor(
              "| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |",
            )
          }
        >
          <FontAwesomeIcon icon={faTable} />
        </Button>
        <Button
          kind="secondary"
          type="button"
          title="Horizontal Rule"
          onClick={() => insertAtCursor("\n---\n")}
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>
        {extraTools}
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={setText}
        {...props}
      ></textarea>
    </>
  )
}
