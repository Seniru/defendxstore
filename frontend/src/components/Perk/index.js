import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../Button"
import ProgressBar from "../ProgressBar"
import "./Perk.css"
import { faGift, faHandHolding } from "@fortawesome/free-solid-svg-icons"

export default function Perk({ image, title, description, progress, reward }) {
  return (
    <div className="container perk-container">
      <img src={image} width={40} height={40} />
      <div className="details">
        <div>
          <div className="header">
            <b>{title} </b>
            <Button kind="primary" disabled>
              <FontAwesomeIcon icon={faGift} /> Claim rewards
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
