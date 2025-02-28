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
          fontSize: size - 10 < 5 ? size : size - 10,
          ...style,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    )
  }
}
