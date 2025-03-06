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

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="profile-main">
      <aside className="profile-details">
        <div className="profile-image-containter">
          <ProfileImage username={user.username} size={100} />
          <div className="camera">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        <br />
        Welcome,
        <br />
        <b className="username">{user.username}</b>
        <hr />
        <br />
        <FontAwesomeIcon icon={faPencil} className="profile-edit" />
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
            123/12A, Somewhere street, Maharagama, 10280
          </div>
          <br />
          <div>
            <div className="profile-title">
              <FontAwesomeIcon icon={faPhone} size="sm" /> Telephone
            </div>
            011-2345689
          </div>
        </div>
        <div className="profile-actions">
          <Button kind="danger">
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


  )

  
}
