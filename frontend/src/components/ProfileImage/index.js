import "./ProfileImage.css"

export default function ProfileImage({ image, username, size, style }) {
  if (image) {
  } else {
    return (
      <div
        className="profile-image"
        style={{
          width: size,
          height: size,
          fontSize: size,
          ...style,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    )
  }
}
