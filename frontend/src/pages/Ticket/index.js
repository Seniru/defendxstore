import {
  faHeadset,
  faPen,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileImage from "../../components/ProfileImage"

import "./Ticket.css"
import Button from "../../components/Button"

export default function Ticket() {
  return (
    <div className="content">
      <h1>
        {" "}
        <FontAwesomeIcon icon={faHeadset} /> Customer Support
      </h1>
      <div className="ticket-container">
        <div className="ticket-type">
          <div>
            <ProfileImage username="User" size={50} />
            Username
          </div>
          <div>Ticket Type Date</div>
        </div>

        <div>
          <div className="Edit-Delete">
            <div>
              <div>
                <h3>Ticket #1</h3>
                <h2>Title</h2>
              </div>
            </div>

            <div>
              <div>
                <span className="Open">OPEN</span>{" "}
                <FontAwesomeIcon icon={faPen} />{" "}
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
          <div>
            frufhruhr greufhwefuwehfweuh fehfewufhefehf wefheufhef fekfweufhefwe
            foefeffjfnef fefeenfewfnefnefnefefwefefefe dfkdjfweifjwekfjwefjrf
            ffjmwekfjefijeefwkgjefejwf dfdfjfffffk fkfkkkfkfkfkfkfkfkfkffkefdo
            rfkijrijrrijeiejewfwef fefiejfeijefijefefjfefio feofefejffidjffejfew
            fefdjfifjwefewjfdkfffpofefoefpeofefpefefjfwefjfepjepojf effjfdljfdi
            jfjfdjfpfdfdjfpdisfdfokdfpfkepfkpkfpejfee
          </div>
          <div className="Button">
            <Button kind="primary">Resolve ticket</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
