import { useState } from "react"
import Perk from "../../components/Perk"
import useFetch from "../../hooks/useFetch"
import MessageBox from "../../components/MessageBox"
import { useAuth } from "../../contexts/AuthProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faExclamation,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"

const { REACT_APP_API_URL } = process.env

export default function Perks() {
  const { user } = useAuth()
  const [refreshPerks, setRefreshPerks] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [perks] = useFetch(
    `${REACT_APP_API_URL}/api/perks`,
    { body: [] },
    refreshPerks,
  )
  const [profileData] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user.username}`,
  )

  return (
    <div>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      {!profileData?.body?.user?.verified && (
        <div style={{ position: "relative" }}>
          <div className="content perks-unverified">
            <b>
              <FontAwesomeIcon icon={faExclamationTriangle} /> You must verify
              your account to enjoy these benefits
            </b>
          </div>
        </div>
      )}
      <div className="perks-list">
        {!profileData?.body?.user?.verified && (
          <div className="perks-unverified-overlay"></div>
        )}
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
      </div>
    </div>
  )
}
