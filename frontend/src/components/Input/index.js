import { useState } from "react"
import "./Input.css"

export default function Input({
  type = "text",
  value,
  placeholder,
  onChange,
  width,
  style,
  ...props
}) {
  let [displayPlaceholder, setDisplayPlaceholder] = useState(false)

  return (
    <div className="input">
      <span
        className="placeholder-label"
        style={{ display: displayPlaceholder ? "block" : "none" }}
      >
        {placeholder}
      </span>
      <input
        type={type}
        value={value}
        placeholder={displayPlaceholder ? "" : placeholder}
        onChange={onChange}
        onFocus={() => setDisplayPlaceholder(true)}
        onBlur={() => setDisplayPlaceholder(false)}
        style={{
          ...style,
          width,
        }}
        {...props}
      />
    </div>
  )
}
