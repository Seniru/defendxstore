import { useState } from "react"
import Perk from "../../components/Perk"
import useFetch from "../../hooks/useFetch"
import MessageBox from "../../components/MessageBox"

const { REACT_APP_API_URL } = process.env

export default function Perks() {
  const [refreshPerks, setRefreshPerks] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [perks] = useFetch(
    `${REACT_APP_API_URL}/api/perks`,
    { body: [] },
    refreshPerks,
  )

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      {perks?.body?.map((perk) => (
        <Perk
          key={perk.id}
          id={perk.id}
          image={`${REACT_APP_API_URL}/${perk.image}`}
          title={perk.title}
          description={perk.description}
          progress={{ progress: perk.progress, max: perk.maxProgress }}
          claimed={perk.claimed}
          reward={perk.rewardText}
          setIsError={setIsError}
          message={message}
          setMessage={setMessage}
          refreshPerks={refreshPerks}
          setRefreshPerks={setRefreshPerks}
        />
      ))}
    </>
  )
}
