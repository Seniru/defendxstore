import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import { useAuth } from "../../contexts/AuthProvider"

import {
  faAddressCard,
  faAt,
  faCamera,
  faPencil,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

import "./Profile.css"
import TabMenu from "../../components/TabMenu"
import TabItem from "../../components/TabMenu/TabItem"
import Reviews from "./Reviews"
import { useRef, useState } from "react"
import api from "../../utils/api"
import OverlayWindow from "../../components/OverlayWindow"
import ChangePasswordForm from "../../forms/ChangePasswordForm"
import MessageBox from "../../components/MessageBox"
import DeleteAccountForm from "../../forms/DeleteAccountForm"
import ChangeBillingInformationForm from "../../forms/ChangeBillingInformationForm"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function Profile() {
  const { user, token } = useAuth()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [isPassswordFormOpen, setIsPasswordFormOpen] = useState(false)
  const [isDeleteAccountFormOpen, setIsDeleteAccountFormOpen] = useState(false)
  const [isBillingInfoFormOpen, setIsBillingInfoFormOpen] = useState(false)
  const imageRef = useRef()

  const [profileData] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user.username}`,
    null,
    null,
    {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  )

  const openProfilePictureChanger = () => {
    imageRef.current.click()
  }

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const image = reader.result.split(",")[1]
      const url = `data:${file.type};base64,${image}`
      api.put(`/api/users/${user.username}/profileImage`, { image: url }, token)
      window.location.reload()
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <OverlayWindow
        isOpen={isPassswordFormOpen}
        setIsOpen={setIsPasswordFormOpen}
      >
        <ChangePasswordForm
          setIsError={setIsError}
          setMessage={setMessage}
          setIsOpen={setIsPasswordFormOpen}
        />
      </OverlayWindow>
      <OverlayWindow
        isOpen={isDeleteAccountFormOpen}
        setIsOpen={setIsDeleteAccountFormOpen}
      >
        <DeleteAccountForm
          setIsOpen={setIsDeleteAccountFormOpen}
          setIsError={setIsError}
          setMessage={setMessage}
        />
      </OverlayWindow>
      <OverlayWindow
        isOpen={isBillingInfoFormOpen}
        setIsOpen={setIsBillingInfoFormOpen}
      >
        <ChangeBillingInformationForm
          setIsOpen={isBillingInfoFormOpen}
          setIsError={setIsError}
          setMessage={setMessage}
        />
      </OverlayWindow>
      <div className="profile-main">
        <aside className="profile-details">
          <div className="profile-image-containter">
            <ProfileImage username={user.username} size={100} />
            <div className="camera">
              <FontAwesomeIcon
                icon={faCamera}
                cursor="pointer"
                title="Change profile picture"
                onClick={openProfilePictureChanger}
              />
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <br />
          Welcome,
          <br />
          <b className="username">{user.username}</b>
          <hr />
          <br />
          <FontAwesomeIcon
            icon={faPencil}
            className="profile-edit"
            cursor="pointer"
            title="Edit profile"
            onClick={() => setIsBillingInfoFormOpen(true)}
          />
          <br />
          <div>
            <div>
              <div className="profile-title">
                <FontAwesomeIcon icon={faAt} size="sm" /> Email
              </div>
              {user.email}
            </div>
            <br />
            <div>
              <div className="profile-title">
                <FontAwesomeIcon icon={faAddressCard} size="sm" /> Shipping
                address
              </div>
              {profileData &&
                (profileData.body?.user?.deliveryAddress || "N/A")}
            </div>
            <br />
            <div>
              <div className="profile-title">
                <FontAwesomeIcon icon={faPhone} size="sm" /> Telephone
              </div>
              {profileData &&
                (profileData.body?.user?.contactNumber
                  ? profileData.body?.user?.contactNumber[0]
                  : "N/A")}
            </div>
          </div>
          <div className="profile-actions">
            <Button
              kind="secondary"
              onClick={() => setIsPasswordFormOpen(true)}
            >
              <FontAwesomeIcon icon={faPencil} /> Edit password
            </Button>
            <Button
              kind="danger"
              onClick={() => setIsDeleteAccountFormOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete profile
            </Button>
          </div>
        </aside>
        <div className="profile-content">
          <TabMenu>
            <TabItem name="Orders" />
            <TabItem name="Reviews" element={<Reviews />} />
          </TabMenu>
        </div>
      </div>
    </>
  )
}
