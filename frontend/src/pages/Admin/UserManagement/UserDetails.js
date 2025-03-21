import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Role from "./Role"
import {
  faAddressCard,
  faAt,
  faCamera,
  faCirclePlus,
  faInfoCircle,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import ProfileImage from "../../../components/ProfileImage"
import OverlayWindow from "../../../components/OverlayWindow"
import DeleteAccountForm from "../../../forms/DeleteAccountForm"
import { useRef, useState } from "react"
import { useAuth } from "../../../contexts/AuthProvider"
import api from "../../../utils/api"
import AddRoleForm from "../../../forms/AddRoleForm"

export default function UserDetails({
  id,
  username,
  email,
  deliveryAddress,
  contactNumbers,
  roles,
  keyProp,
  setIsError,
  setMessage,
  refreshFlag,
  setRefreshFlag,
}) {
  const [isDeleteAccountFormOpen, setIsDeleteAccountFormOpen] = useState(false)
  const [isAddRoleFormOpen, setIsAddRoleFormOpen] = useState(false)
  const imageRef = useRef()
  const { token } = useAuth()

  const openProfilePictureChanger = () => {
    imageRef.current.click()
  }

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = async () => {
      const image = reader.result.split(",")[1]
      const url = `data:${file.type};base64,${image}`
      await api.put(
        `/api/users/${username}/profileImage`,
        { image: url },
        token,
      )
      setRefreshFlag(!refreshFlag)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <OverlayWindow
        isOpen={isDeleteAccountFormOpen}
        setIsOpen={setIsDeleteAccountFormOpen}
      >
        <DeleteAccountForm
          username={username}
          setIsError={setIsError}
          setMessage={setMessage}
          setIsOpen={setIsDeleteAccountFormOpen}
          onSuccess={() => {
            setRefreshFlag(!refreshFlag)
            setIsError(false)
            setMessage("User deleted")
          }}
        />
      </OverlayWindow>
      <OverlayWindow
        isOpen={isAddRoleFormOpen}
        setIsOpen={setIsAddRoleFormOpen}
      >
        <AddRoleForm
          username={username}
          setIsError={setIsError}
          setMessage={setMessage}
          setIsOpen={setIsAddRoleFormOpen}
          refreshFlag={refreshFlag}
          setRefreshFlag={setRefreshFlag}
        />
      </OverlayWindow>
      <div className="container user-details-container" key={keyProp}>
        <div className="user-details">
          <div className="user-profile-image">
            <ProfileImage username={username} size={50} />
            <div className="camera">
              <FontAwesomeIcon
                icon={faCamera}
                cursor="pointer"
                title="Change profile picture"
                color="white"
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
          <div
            className="user-details-text"
            key={`user-details-text-${keyProp}`}
          >
            <div>
              <span className="username">{username}</span>
              {roles.map((role) => (
                <Role
                  username={username}
                  role={role}
                  setIsError={setIsError}
                  setMessage={setMessage}
                  refreshFlag={refreshFlag}
                  setRefreshFlag={setRefreshFlag}
                />
              ))}{" "}
              <FontAwesomeIcon
                icon={faCirclePlus}
                color="var(--secondary-text-color)"
                cursor="pointer"
                size="lg"
                title="Add new role"
                onClick={() => setIsAddRoleFormOpen(true)}
              />
            </div>
            <div>
              <div className="secondary-text">
                <FontAwesomeIcon icon={faAt} size="sm" /> {email}
              </div>
              <br />
              {contactNumbers && (
                <div>
                  {contactNumbers.map((contactNumber, index) => (
                    <div key={index}>
                      <FontAwesomeIcon icon={faPhone} size="sm" />{" "}
                      {contactNumber}
                    </div>
                  ))}
                </div>
              )}
              {deliveryAddress && (
                <div>
                  <FontAwesomeIcon icon={faAddressCard} size="sm" />{" "}
                  {deliveryAddress}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faTrash}
            color="red"
            cursor="pointer"
            onClick={() => setIsDeleteAccountFormOpen(true)}
          />
        </div>
      </div>
    </>
  )
}
