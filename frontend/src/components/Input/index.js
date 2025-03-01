import { useState } from "react"
import "./Input.css"

export default function Input({
  type = "text",
  value,
  error,
  placeholder,
  onChange,
  width,
  style = {},
  ...props
}) {
  let [displayPlaceholder, setDisplayPlaceholder] = useState(false)
  if (error) style.border = "2px solid var(--error-color)"

  return (
    <div className="input" style={{ width }}>
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
        }}
        {...props}
      />
      <span className="input-error">{error}</span>
    </div>
  )
}
