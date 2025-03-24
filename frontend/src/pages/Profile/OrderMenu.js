import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"
import { faStar } from "@fortawesome/free-solid-svg-icons"

import "./Profile.css"
import Select from "../../components/Select"

function Order({}) {
  return (

    <div className="Order-container container">
      <div className="Order-stars">
        Orders #1
        <div className="Order-profile">
        <ProfileImage username={"supun"} size={50} />
     
        </div>
      </div>
      <div className="Order-content">
        1 x Black shirt , Delivered to maharagama.on 2025/01/25
        RS.3900
      </div>

      <div className="Status">
        PENDING
       
       
      </div>
    </div>
  )
}

export default function OrderMenu() {
  return (
    <div className="content">
        <div>
        Orders/Deliveries
        status
      <Select items={[ "All","Pending","Done","shipping"]} />
      </div>
      <Order />
      <Order />
      
    </div>
  )
}
