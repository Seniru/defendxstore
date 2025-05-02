import { useEffect, useMemo, useState } from "react"
import "./Select.css"
import Input from "../Input"

export default function Select({
  items,
  onMultiChange,
  multiple = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    if (!Array.isArray(items)) return {}
    return items.reduce((acc, item) => {
      acc[item] = false
      return acc
    }, {})
  })

  // Handle checkbox changes
  const handleCheckboxChange = (item) => {
    setSelected((prevSelected) => ({
      ...prevSelected,
      [item]: !prevSelected[item],
    }))
  }

  // Filter selected items
  const selectedItems = useMemo(
    () => Object.keys(selected).filter((item) => selected[item]),
    [selected],
  )

  useEffect(() => {
    if (onMultiChange) onMultiChange(selectedItems)
  }, [selectedItems, onMultiChange])

  if (multiple) {
    return (
      <div className="select-container">
        <div className="select selected" onClick={() => setIsOpen(!isOpen)}>
          {selectedItems.length} selected
        </div>
        {isOpen && (
          <div className="select-menu container">
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <label>
                    <Input
                      type="checkbox"
                      value={item}
                      onChange={(evt) => handleCheckboxChange(evt.target.value)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  let options
  if (!Array.isArray(items)) {
    options = Object.keys(items).map((value, i) => (
      <option key={i} value={value}>
        {items[value]}
      </option>
    ))
  } else {
    options = items.map((value, i) => (
      <option key={i} value={value}>
        {value}
      </option>
    ))
  }

  return (
    <select className="select" {...props}>
      {options}
    </select>
  )
}
