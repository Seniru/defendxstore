import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"

import Button from "../../components/Button"
import Input from "../../components/Input"
import ProfileImage from "../../components/ProfileImage"

export default function ProfileImageForm() {
  const navigate = useNavigate()

  const handleSubmit = (evt) => {}

  return (
    <form onSubmit={handleSubmit} className="profile-image-form">
      <div className="heading">
        <h3>Submit a photo</h3>
        <p className="secondary-text">
          <FontAwesomeIcon icon={faCircleInfo} /> Submit a photo to set as your
          profile picture. You can skip this step and set a profile picture
          later.
        </p>
        <hr />
      </div>
      <p className="secondary-text">
        <FontAwesomeIcon icon={faCircleInfo} /> Select an image from your device
        and submit. Your image will appear below after processing.
      </p>
      <Input type="file" />

      <ProfileImage
        username="Seniru"
        size={250}
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      />
      <Button kind="primary" type="submit">
        Submit
      </Button>
      <Button
        kind="secondary"
        type="button"
        onClick={() => navigate("/auth/login")}
      >
        Already have an account? Login instead
      </Button>
    </form>
  )
}
