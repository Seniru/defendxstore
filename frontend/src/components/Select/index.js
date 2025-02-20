import "./Select.css"

export default function Select({ items, ...props }) {
  let options

  if (typeof items == "object") {
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

  return <select {...props}>{options}</select>
}
