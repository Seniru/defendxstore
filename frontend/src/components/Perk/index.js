import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../Button"
import ProgressBar from "../ProgressBar"
import "./Perk.css"
import {
  faBoxOpen,
  faGift,
  faHandHolding,
} from "@fortawesome/free-solid-svg-icons"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import OverlayWindow from "../OverlayWindow"
import { useState } from "react"

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
  const [isResultWindowOpen, setIsResultWindowOpen] = useState(false)
  const [claimResult, setClaimResult] = useState(null)

  const claimReward = async (evt) => {
    const response = await api.post(`/api/perks/${id}/claim`, {}, token)
    const result = await response.json()
    setIsError(!response.ok)
    if (response.ok) {
      setMessage("Perk claimed!")
      setRefreshPerks(!refreshPerks)
      setClaimResult(result)
      setIsResultWindowOpen(true)
    } else {
      setMessage(result.body || response.statusText)
    }
  }

  const processReward = (reward) => {
    if (reward === null) return
    switch (reward.type) {
      case "promocode":
        return (
          <span>
            You have earned a perk! Use code <b>{reward.promocode.code}</b> at
            checkout!
          </span>
        )
      default:
        return "You have earned a perk!"
    }
  }

  return (
    <>
      <OverlayWindow
        isOpen={isResultWindowOpen}
        setIsOpen={setIsResultWindowOpen}
      >
        <h3>
          <FontAwesomeIcon icon={faGift} /> Perk claimed!
        </h3>
        <hr />
        <br />
        {processReward(claimResult?.body || null)}
      </OverlayWindow>
      <div className="container perk-container">
        <img src={image} width={40} height={40} />
        <div className="details">
          <div>
            <div className="header">
              <b>{title} </b>
              <Button
                kind="primary"
                disabled={claimed || progress.progress < progress.max}
                style={{
                  color:
                    claimed || progress.progress < progress.max
                      ? "var(--secondary-text-color)"
                      : "white",
                }}
                onClick={claimReward}
              >
                <FontAwesomeIcon icon={claimed ? faBoxOpen : faGift} />{" "}
                {claimed ? "Claimed" : "Claim rewards"}
              </Button>
            </div>
            <p>{description}</p>
            <p className="secondary-text">
              <FontAwesomeIcon icon={faGift} /> Reward: <b>{reward}</b>
            </p>
          </div>
          <div className="actions">
            <ProgressBar
              min={0}
              max={progress.max}
              progress={progress.progress}
              label={`${((progress.progress / progress.max) * 100).toFixed(2)}% Progress (${progress.progress}/${progress.max})`}
            />
          </div>
        </div>
      </div>
    </>
  )
}
