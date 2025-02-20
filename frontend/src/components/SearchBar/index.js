import "./SearchBar.css"
import searchIcon from "../../assets/images/search-solid.svg"

export default function SearchBar({ placeholder, width, style, ...props }) {
  return (
    <div className="search-bar-container" style={{ ...style, width }}>
      <input
        type="search"
        className="search-bar"
        placeholder={placeholder}
        {...props}
      />
      <img src={searchIcon} alt="Search Icon" className="search-icon" />
    </div>
  )
}
