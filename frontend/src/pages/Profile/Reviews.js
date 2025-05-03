import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import pro1 from "../../assets/images/pro1.png"

function Review({}) {
  return (
    <div className="review-container container">
      <div className="review-stars">
        Orders #1
        <div>
          <FontAwesomeIcon icon={faStar} color="yellow" />
          <FontAwesomeIcon icon={faStar} color="yellow" />
          <FontAwesomeIcon icon={faStar} color="yellow" />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
      </div>
      <div className="review-content">
        Yours Clothing: "I cannot praise this store enough. Orders ship and
        arrive so fast. Everything I buy fits perfectly. Quality is like no
        other, and prices are excellent".
      </div>

      <div className="review-profile">
        <div className="review-profile-details">
          <ProfileImage username="User" size={30} /> <span>User</span>
        </div>
        <span className="secondary-text">2024/04/03</span>
      </div>
    </div>
  )
}

export default function Reviews() {
  return (
    <div className="content">
      <Review />
      <Review />
    </div>
  )
}
