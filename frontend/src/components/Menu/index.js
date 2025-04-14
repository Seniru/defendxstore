import "./Menu.css"

export default function Menu({ isOpen, setIsOpen, children, left, right }) {
  return (
    isOpen && (
      <div className="container menu-container" style={{ left, right }}>
        {children}
      </div>
    )
  )
}
