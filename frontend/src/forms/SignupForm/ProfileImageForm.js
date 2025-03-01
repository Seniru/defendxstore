import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleInfo,
  faChevronLeft,
  faUpload,
} from "@fortawesome/free-solid-svg-icons"

import Button from "../../components/Button"
import Input from "../../components/Input"
import ProfileImage from "../../components/ProfileImage"
import { useEffect, useRef, useState } from "react"
import { usePagination } from "../../contexts/PaginationProvider"
import { useAuth } from "../../contexts/AuthProvider"
import api from "../../utils/api"

export default function ProfileImageForm({ data, setData, errors, setErrors }) {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const { setPage, gotoPreviousPage } = usePagination()
  const [imageUrl, setImageUrl] = useState(null)
  const [imageError, setImageError] = useState(null)
  const imageRef = useRef()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isImageValid = imageRef.current.validity.valid

    setImageError(isImageValid ? null : imageRef.current.validationMessage)
    if (imageRef.current.files[0]) {
      let imageSize = imageRef.current.files[0].size
      if (imageRef.current.size > 2 * 2 ** 20)
        setImageError(
          `Image should be less than 2 MB in size. Upload size: ${(imageSize / 1e6).toFixed(1)} MB`,
        )

      if (isImageValid) {
        setData({
          ...data,
          imageUrl,
        })
      }
    }

    // submit the data
    let response = await api.post("/api/users", data)
    let result = await response.json()

    if (response.ok) {
      setToken(result.body.token)
      return navigate("/")
    }

    let field = result.body[0].field
    setErrors(result.body[0])

    switch (field) {
      case "username":
      case "email":
      case "password":
        setPage(0)
        break
      case "deliveryAddress":
        setPage(1)
        break
      case "profileImage":
        // stay in this page
        break
      default:
        console.error("Unidentified field in the result body")
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const image = reader.result.split(",")[1]
      setImageUrl(`data:${file.type};base64,${image}`)
      setData({
        ...data,
        image: `data:${file.type};base64,${image}`,
      })
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!errors?.field) return
    if (errors.field === "profileImage") {
      setImageError(errors.message)
    }
  }, [errors])

  return (
    <>
      <div className="signup-back secondary-text" onClick={gotoPreviousPage}>
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </div>

      <form onSubmit={handleSubmit} className="profile-image-form">
        <div className="heading">
          <h3>Submit a photo</h3>
          <p className="secondary-text">
            <FontAwesomeIcon icon={faCircleInfo} /> Submit a photo to set as
            your profile picture. You can skip this step and set a profile
            picture later.
          </p>
          <hr />
        </div>
        <p className="secondary-text">
          <FontAwesomeIcon icon={faCircleInfo} /> Select an image from your
          device and submit. Your image will appear below after processing.
        </p>
        <div className="image-upload-options">
          <div className="image-upload-option">
            <FontAwesomeIcon icon={faUpload} />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={imageRef}
              error={imageError}
            />
          </div>
        </div>
        <ProfileImage
          username="Seniru"
          image={imageUrl || data.image}
          size={150}
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
    </>
  )
}
