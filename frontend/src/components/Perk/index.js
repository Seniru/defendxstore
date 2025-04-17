import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../Button"
import ProgressBar from "../ProgressBar"
import "./Perk.css"
import { faGift, faHandHolding } from "@fortawesome/free-solid-svg-icons"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"

export default function Perk({
  id,
  image,
  title,
  description,
  progress,
  reward,
  claimed,
  setMessage,
  setIsError,
  refreshPerks,
  setRefreshPerks,
}) {
  const { token } = useAuth()

  const claimReward = async (evt) => {
    const response = await api.post(`/api/perks/${id}/claim`, {}, token)
    setIsError(!response.ok)
    if (response.ok) {
      setMessage("Perk claimed!")
      setRefreshPerks(!refreshPerks)
    } else {
      const result = await response.json()
      setMessage(result.body || response.statusText)
    }
  }

  return (
    <div className="container perk-container">
      <img src={image} width={40} height={40} />
      <div className="details">
        <div>
          <div className="header">
            <b>{title} </b>
            <Button
              kind="primary"
              disabled={claimed || progress.progress < progress.max}
              onClick={claimReward}
            >
              <FontAwesomeIcon icon={faGift} />{" "}
              {claimed ? "Claimed" : "Claim rewards"}
            </Button>
          </div>
          <p>{description}</p>
          <p className="secondary-text">
            <FontAwesomeIcon icon={faGift} /> Reward: <b>{reward}</b>
          </p>
        </div>
        <div class="actions">
          <ProgressBar
            min={0}
            max={progress.max}
            progress={progress.progress}
            label={`${((progress.progress / progress.max) * 100).toFixed(2)}% Progress (${progress.progress}/${progress.max})`}
          />
        </div>
      </div>
    </div>
  )
}
