// credits: https://www.w3schools.com/react/react_customhooks.asp

import { useState, useEffect } from "react"

const useFetch = (url, initialValue, refreshFlag) => {
  const [data, setData] = useState(initialValue)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let response = await fetch(url, { headers })
        let result = await response.json()
        if (!response.ok) throw new Error(result.body || response.statusText)
        setData(result)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchData()
  }, [url, token, refreshFlag])

  return [data, error, isLoading]
}

export default useFetch
