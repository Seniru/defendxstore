import "./Button.css"

export default function Button({
  kind,
  className,
  onClick,
  children,
  ...props
}) {
  return (
    <button
      className={`${kind || "primary"} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
