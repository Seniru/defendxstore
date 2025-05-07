import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./Order.css"
import {
  faAt,
  faBoxesPacking,
  faCalendar,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faMap,
  faPhone,
  faRoute,
  faTrash,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import Button from "../Button"
import api from "../../utils/api"
import { useAuth } from "../../contexts/AuthProvider"
import MessageBox from "../MessageBox"
import { useEffect, useMemo, useRef, useState } from "react"
import ProfileImage from "../ProfileImage"
import View from "ol/View"
import Map from "ol/Map"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"
import getLocation from "../../utils/getLocation"
import { add } from "ol/coordinate"
import { useGeographic } from "ol/proj"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import { LineString, Point } from "ol/geom"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import VectorLayer from "ol/layer/Vector"
import Stroke from "ol/style/Stroke"
import decodePolyline from "../../utils/decodedPolyline"

const markerStyle = new Style({
  image: new Icon({
    src: "/images/pin.png",
    anchor: [0.5, 1],
  }),
})

export default function Order({
  order,
  includeAcquireButton,
  includeStartDeliveryButton,
  includeCompleteDeliveryButton,
  includeUser,
  includeAgent,
  includeMap,
  refreshOrders,
  setRefreshOrders,
}) {
  useGeographic()

  const { token } = useAuth()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [coords, setCoords] = useState([0, 0])
  const mapRef = useRef(null)

  const address = order.deliveryAddress
  const vectorSource = useMemo(() => new VectorSource({}), [])

  const vectorLayer = useMemo(
    () =>
      new VectorLayer({
        source: vectorSource,
      }),
    [vectorSource],
  )

  useEffect(() => {
    if (!isMapOpen) return
    ;(async () => {
      const coordMatches = address.match(/\(([\d.-]+),\s*([\d.-]+)\)/)
      if (coordMatches) {
        setCoords([parseFloat(coordMatches[1]), parseFloat(coordMatches[2])])
      } else {
        let houseNo, street, city, postalCode
        let addressFragments = (address || "").split("\n")
        if (addressFragments[0]) {
          let houseInfo = addressFragments[0].split(", ")
          houseNo = houseInfo[0]
          street = houseInfo[1]
        }
        if (addressFragments[1]) {
          let cityInfo = addressFragments[1].split(", ")
          postalCode = cityInfo[0]
          city = cityInfo[1]
        }
        setCoords(
          await getLocation(
            houseNo || "",
            street || "",
            city || "",
            postalCode || "",
          ),
        )
      }
    })()
  }, [isMapOpen, address])

  useEffect(() => {
    if (!isMapOpen) return
    const mapContainer = document.getElementById(`order-${order._id}`)
    mapContainer.innerHTML = ""

    const view = new View({
      center: coords || [0, 0],
      zoom: 16,
    })

    const map = new Map({
      target: `order-${order._id}`,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view,
    })

    const marker = new Feature({
      geometry: new Point(coords || [0, 0]),
    })

    marker.setStyle(markerStyle)

    vectorSource.addFeature(marker)
    map.addLayer(vectorLayer)

    mapRef.current = map
  }, [vectorLayer, vectorSource, coords, isMapOpen, order._id])

  const acquireDelivery = async () => {
    const response = await api.post(
      `/api/orders/${order._id}/delivery`,
      {},
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(response.ok ? "Delivery acquired" : result.body)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const startDelivery = async () => {
    const response = await api.put(
      `/api/orders/${order._id}/delivery`,
      { status: "on_the_way" },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const completeDelivery = async () => {
    const response = await api.put(
      `/api/orders/${order._id}/delivery`,
      { status: "delivered" },
      token,
    )
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const deleteOrder = async () => {
    const response = await api.delete(`/api/orders/${order._id}`, {}, token)
    const result = await response.json()
    setIsError(!response.ok)
    setMessage(result.body || response.statusText)
    if (setRefreshOrders) setRefreshOrders(!refreshOrders)
  }

  const getDirections = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const start = [pos.coords.longitude, pos.coords.latitude]
          const end = coords

          const response = await fetch(
            "https://api.openrouteservice.org/v2/directions/foot-walking/json",
            {
              method: "POST",
              headers: {
                Authorization: process.env.REACT_APP_OPEN_ROUTE_SERVICE_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                coordinates: [start, end],
              }),
            },
          )

          const data = await response.json()
          const routeCoords = data.routes[0].geometry
          const decodedCoords = decodePolyline(routeCoords)
          const route = new Feature({
            geometry: new LineString(decodedCoords),
          })

          route.setStyle(
            new Style({
              stroke: new Stroke({
                color: "#000000",
                width: 5,
              }),
            }),
          )

          const startMarker = new Feature({ geometry: new Point(start) })
          const endMarker = new Feature({ geometry: new Point(end) })
          startMarker.setStyle(markerStyle)
          endMarker.setStyle(markerStyle)

          vectorSource.clear()
          vectorSource.addFeature(route)
          vectorSource.addFeature(endMarker)

          mapRef.current
            .getView()
            .fit(route.getGeometry(), { padding: [50, 50, 50, 50] })
        },
        (error) => {
          setIsError(true)
          setMessage(`Failed to get directions: ${error.message}`)
        },
      )
    }
  }

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <div className="profile-order-container container">
        <div className="order-header">
          <div>
            <a href={`/invoice?id=${order._id}`}>
              #{order._id} <FontAwesomeIcon icon={faChevronRight} />
            </a>
          </div>
          <div style={{ display: "flex" }}>
            {order.status === "delivered" && (
              <Button kind="danger-secondary" onClick={deleteOrder}>
                <FontAwesomeIcon icon={faTrash} /> Delete order
              </Button>
            )}

            <div
              className="order-status"
              style={{
                backgroundColor: {
                  pending: "#FACC15", // amber-400
                  on_the_way: "#38BDF8", // sky-400
                  delivered: "#4ADE80", // green-400
                }[order.status],
              }}
            >
              {order.status.toUpperCase().replaceAll("_", " ")}
            </div>
          </div>
        </div>
        <div className="order-body">
          <img
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
            src={order.items[0].product}
          />
          <div className="order-details">
            <div className="secondary-text">
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {new Date(order.orderdate).toLocaleString()}
            </div>
            <div
              className="location-details"
              onClick={() => setIsMapOpen(!isMapOpen)}
            >
              <div className="secondary-text">
                <FontAwesomeIcon icon={faMap} /> {order.deliveryAddress}
              </div>
              {includeMap && (
                <div className="secondary-text">
                  {isMapOpen ? (
                    <>
                      Hide map <FontAwesomeIcon icon={faChevronUp} />
                    </>
                  ) : (
                    <>
                      Show map <FontAwesomeIcon icon={faChevronDown} />
                    </>
                  )}
                </div>
              )}
            </div>
            <br />

            <div
              id={`order-${order._id}`}
              style={{ height: isMapOpen ? 400 : 0 }}
            />
            {isMapOpen && (
              <>
                <Button
                  kind="primary"
                  onClick={getDirections}
                  className="map-route-button"
                >
                  <FontAwesomeIcon icon={faRoute} size="lg" />
                </Button>
                <br />
                <hr />
              </>
            )}
            <div>
              {order.items.map((item) => (
                <div className="order-item">
                  <div
                    className="color-square"
                    style={{
                      backgroundColor: item.color,
                      display: "inline-block",
                      marginRight: 10,
                    }}
                  ></div>
                  <div>
                    <div>
                      <b>{item.itemName}</b> ({item.size})
                    </div>
                    <div>
                      LKR {item.price?.toFixed(2)}{" "}
                      <span className="secondary-text"> x {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <hr />
            <div>
              Total: <b>LKR {order.price.toFixed(2)}</b>
            </div>
            <br />
            <div className="order-footer">
              <div>
                {includeUser && (
                  <div className="details">
                    <span className="secondary-text">Order placed by</span>
                    <div className="detail">
                      <ProfileImage
                        username={order.user.username || "-"}
                        size={20}
                      />
                      {order.user.username}
                    </div>
                    <div className="detail">
                      <FontAwesomeIcon icon={faAt} style={{ marginRight: 5 }} />{" "}
                      {order.user.email}
                    </div>
                    {order.user.contactNumber.length > 0 && (
                      <div className="detail">
                        <FontAwesomeIcon
                          icon={faPhone}
                          style={{ marginRight: 5 }}
                        />{" "}
                        {order.user.contactNumber}
                      </div>
                    )}
                  </div>
                )}
                {includeAgent && (
                  <div className="details">
                    <span className="secondary-text">Assigned agent</span>
                    <div className="detail">
                      <ProfileImage
                        username={order.assignedAgent.username || "-"}
                        size={20}
                      />
                      {order.assignedAgent.username}
                    </div>
                    <div className="detail">
                      <FontAwesomeIcon icon={faAt} style={{ marginRight: 5 }} />{" "}
                      {order.assignedAgent.email}
                    </div>
                    {order.assignedAgent.contactNumber.length > 0 && (
                      <div className="detail">
                        <FontAwesomeIcon
                          icon={faPhone}
                          style={{ marginRight: 5 }}
                        />{" "}
                        {order.assignedAgent.contactNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                {includeAcquireButton && (
                  <Button kind="primary" onClick={acquireDelivery}>
                    <FontAwesomeIcon icon={faBoxesPacking} /> Acquire delivery
                  </Button>
                )}
                {includeStartDeliveryButton && (
                  <Button kind="primary" onClick={startDelivery}>
                    <FontAwesomeIcon icon={faTruck} /> Start delivery
                  </Button>
                )}
                {includeCompleteDeliveryButton && (
                  <Button kind="primary" onClick={completeDelivery}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Complete delivery
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
