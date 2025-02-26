import { useEffect, useState } from "react"

import "./TabMenu.css"

function Tab({ name, width, selected, onClick }) {
  return (
    <div
      className={`tab${selected ? " selected" : ""}`}
      style={{ width }}
      onClick={onClick}
    >
      {name}
    </div>
  )
}

export default function TabMenu({ children }) {
  let [tabs, setTabs] = useState([])
  let [currentTab, setCurrentTab] = useState(0)

  useEffect(() => {
    let t = []
    for (let item of children) {
      t.push(item.props.name)
    }
    setTabs(t)
  }, [children, setTabs])

  return (
    <div className="tabbed-interface">
      <div className="tab-menu">
        {tabs.map((tab, index) => (
          <Tab
            name={tab}
            width={`${100 / tabs.length}%`}
            selected={index === currentTab}
            onClick={() => setCurrentTab(index)}
            key={index}
          />
        ))}
      </div>
      <div className="tab-active-view">
        {children[currentTab].props.element}
      </div>
    </div>
  )
}
