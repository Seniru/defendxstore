import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import { useAuth } from "../../contexts/AuthProvider"

import {
  faAddressCard,
  faAt,
  faCamera,
  faCircleCheck,
  faPencil,
  faPhone,
  faShieldHalved,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

import "./Profile.css"
import TabMenu from "../../components/TabMenu"
import TabItem from "../../components/TabMenu/TabItem"
import Reviews from "./Reviews"
import OrderMenu from "./OrderMenu"
import { useRef, useState } from "react"
import api from "../../utils/api"
import OverlayWindow from "../../components/OverlayWindow"
import ChangePasswordForm from "../../forms/ChangePasswordForm"
import MessageBox from "../../components/MessageBox"
import DeleteAccountForm from "../../forms/DeleteAccountForm"
import ChangeBillingInformationForm from "../../forms/ChangeBillingInformationForm"
import useFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import Perks from "./Perks"

const { REACT_APP_API_URL } = process.env

export default function Profile() {
  const navigate = useNavigate()
  const { user, token, logoutAction } = useAuth()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [isPassswordFormOpen, setIsPasswordFormOpen] = useState(false)
  const [isDeleteAccountFormOpen, setIsDeleteAccountFormOpen] = useState(false)
  const [isBillingInfoFormOpen, setIsBillingInfoFormOpen] = useState(false)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const imageRef = useRef()

  const [profileData] = useFetch(
    `${REACT_APP_API_URL}/api/users/${user.username}`,
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

  const verify = async () => {
    setIsVerifyDialogOpen(true)
    await api.post("/api/auth/verify", {}, token)
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
          onSuccess={() => {
            navigate("/")
            logoutAction()
          }}
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
      <OverlayWindow
        isOpen={isVerifyDialogOpen}
        setIsOpen={setIsVerifyDialogOpen}
      >
        <h3>Verify your email</h3>
        <hr />
        <p>
          We've sent a verification email to your inbox. Be sure to check your
          spam folder too.
        </p>
        <p>Verifying your account unlocks these benefits:</p>

        <ul>
          <li>Recover your account with ease</li>
          <li>Get access to exclusive discounts</li>
          <li>Stay updated with order and delivery notifications</li>
          <li>...and more perks tailored for you</li>
        </ul>
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
          <b className="username">
            {user.username}{" "}
            {profileData?.body?.user?.verified && (
              <FontAwesomeIcon
                icon={faCircleCheck}
                title="Email verified"
                cursor="pointer"
                color="var(--secondary-text-color)"
                size="xs"
              />
            )}
          </b>
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
              {!profileData?.body?.user?.verified && (
                <div
                  style={{ fontSize: "small", cursor: "pointer" }}
                  className="error-text"
                  onClick={verify}
                >
                  (Email not verified, Verify now!)
                </div>
              )}
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
            <TabItem name="Orders" element={<OrderMenu />} />
            {/* <TabItem name="Reviews" element={<Reviews />} /> */}
            <TabItem name="Perks" element={<Perks />} />
          </TabMenu>
        </div>
      </div>
    </>
  )
}
