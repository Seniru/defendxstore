import { useEffect, useState } from "react"

import "./Pager.css"

export default function Pager({ color, page, pageCount }) {
  let [pageElements, setPageElements] = useState([])

  useEffect(() => {
    let elements = []
    for (let i = 0; i < pageCount; i++) {
      console.log(i, page)
      elements.push(
        <div
          className="pager"
          key={i}
          style={{
            width: `${100 / pageCount}%`,
            backgroundColor: i === page ? color : "transparent",
          }}
        ></div>,
      )
    }
    setPageElements(elements)
  }, [page, color, pageCount])

  return <div className="book">{pageElements}</div>
}
