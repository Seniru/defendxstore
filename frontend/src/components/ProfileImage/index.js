import { useEffect, useState } from "react"
import "./ProfileImage.css"
import api from "../../utils/api"

const { REACT_APP_API_URL } = process.env

export default function ProfileImage({ image, username, size, style }) {
  let [srcImage, setSrcImage] = useState(image)

  useEffect(() => {
    ;(async () => {
      if (image) return
      let response = await api.get(`/api/users/${username}/profileImage`)
      if (response.ok)
        setSrcImage(`${REACT_APP_API_URL}/api/users/${username}/profileImage`)
    })()
  }, [image, username])

  if (image || srcImage) {
    return (
      <img
        key={`pfp-${username}`}
        src={image || srcImage}
        className="profile-image"
        alt="profile-image"
        style={{
          width: size,
          height: size,
          ...style,
        }}
      />
    )
  } else {
    return (
      <div
        key={`pfp-${username}`}
        className="profile-image"
        style={{
          width: size,
          height: size,
          fontSize: size - 10 < 5 ? size : size - 10,
          ...style,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    )
  }
}
