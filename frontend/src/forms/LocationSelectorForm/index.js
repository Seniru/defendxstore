import TileLayer from "ol/layer/Tile"
import Map from "ol/Map"
import { OSM } from "ol/source"
import View from "ol/View"
import { useEffect, useRef } from "react"
import Button from "../../components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationCrosshairs,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"

import "./LocationSelectorForm.css"
import { useGeographic } from "ol/proj"

export default function LocationSelectorForm({
  location,
  setLocation,
  onSubmit,
}) {
  useGeographic()
  const mapRef = useRef(null)

  useEffect(() => {
    const mapContainer = document.getElementById("map")
    mapContainer.innerHTML = ""

    const view = new View({
      center: location,
      zoom: 18,
    })

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view,
    })

    mapRef.current = map
  }, [setLocation, location])

  const applyCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation([pos.coords.longitude, pos.coords.latitude])
      }, console.error)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (mapRef.current) {
      const center = mapRef.current.getView().getCenter()
      onSubmit(center)
    }
  }

  return (
    <>
      <h3>Choose your location</h3>
      <hr />
      <br />
      <form className="map-selector-form">
        <div>
          <div id="map" style={{ width: "800px", height: "400px" }} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
          </div>
        </div>
        <Button type="button" kind="secondary" onClick={applyCurrentLocation}>
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Use my current
          location
        </Button>
        <Button type="submit" kind="primary" onClick={handleSubmit}>
          Submit location
        </Button>
      </form>
    </>
  )
}
