import {
  faCalendar,
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
      <div className="ticket-view-container container">
        <div className="ticket-type">
          <div>
            <ProfileImage username="User" size={50} />
            Username
          </div>
          <div>
            <div className="secondary-text">
              <FontAwesomeIcon icon={faCalendar} /> 2022-01-01
            </div>
          </div>
        </div>

        <div>
          <div className="Edit-Delete">
            <div>
              <div>
                <h3>Ticket #1</h3>
                <div className="secondary-text">Ticket Type</div>
                <h2>Title</h2>
              </div>
            </div>

            <div>
              <div>
                <span className="Open">OPEN</span>{" "}
                <FontAwesomeIcon icon={faPen} />{" "}
                <FontAwesomeIcon icon={faTrash} color="red" />
              </div>
            </div>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a
            tincidunt tellus. Morbi ut vehicula nibh. Suspendisse potenti.
            Curabitur feugiat laoreet nisi, sit amet faucibus libero euismod in.
            Cras elementum id risus in congue. Curabitur pellentesque ipsum sed
            est tempus, id tempus lorem egestas. Vivamus at ligula nibh. Duis
            non tempus libero. Interdum et malesuada fames ac ante ipsum primis
            in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Donec a enim eu quam dignissim consectetur. Vestibulum vitae
            volutpat massa. Pellentesque ut bibendum justo, id pellentesque
            justo. Vestibulum sed fermentum erat. Sed vitae massa non ligula
            sollicitudin accumsan. In laoreet ut quam at varius. Ut pellentesque
            nunc mollis, eleifend nulla vitae, vehicula ligula. Vestibulum id
            nibh luctus, commodo elit sollicitudin, imperdiet neque. Donec eu
            gravida velit, a semper nibh. Praesent risus orci, molestie non
            malesuada quis, condimentum id elit. Cras iaculis lorem in vulputate
            bibendum. Quisque posuere egestas purus a porta. In porta fermentum
            ultrices. Maecenas urna purus, porta sit amet metus nec, dignissim
            accumsan dolor. Sed venenatis condimentum turpis eget faucibus.
            Phasellus semper id magna ut consectetur. Etiam consectetur dui id
            laoreet elementum. Vivamus vestibulum ullamcorper felis, at posuere
            elit ultrices vel. In hac habitasse platea dictumst. Maecenas vitae
            eros elit. Suspendisse accumsan, nisi a porttitor iaculis, nunc
            mauris commodo diam, sit amet feugiat quam eros sit amet augue.
          </div>
          <div className="Button">
            <Button kind="primary">Resolve ticket</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
