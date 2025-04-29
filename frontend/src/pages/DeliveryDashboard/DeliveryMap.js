import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import Map from "ol/Map"
import { OSM } from "ol/source"
import VectorSource from "ol/source/Vector"
import View from "ol/View"
import { useEffect, useMemo } from "react"
import getLocation from "../../utils/getLocation"
import Icon from "ol/style/Icon"
import Style from "ol/style/Style"
import Feature from "ol/Feature"
import { Point } from "ol/geom"

const CENTER_SRI_LANKA = [80.7718, 7.8731]

const pendingMarkerStyle = new Style({
  image: new Icon({
    src: "/images/pending-pin.png",
    anchor: [0.5, 1],
  }),
})

const ongoingMarkerStyle = new Style({
  image: new Icon({
    src: "/images/ongoing-pin.png",
    anchor: [0.5, 1],
  }),
})

const unassignedMarkerStyle = new Style({
  image: new Icon({
    src: "/images/unassigned-pin.png",
    anchor: [0.5, 1],
  }),
})

export default function DeliveryMap({
  myPendingDeliveries,
  myOngoingDeliveries,
  unassignedDeliveries,
}) {
  const vectorSource = useMemo(() => new VectorSource({}), [])

  const vectorLayer = useMemo(
    () =>
      new VectorLayer({
        source: vectorSource,
      }),
    [vectorSource],
  )

  console.log(myPendingDeliveries)

  const getCoords = async (location) => {
    const coordMatches = location.match(/\(([\d.-]+),\s*([\d.-]+)\)/)
    if (coordMatches) {
      return [parseFloat(coordMatches[1]), parseFloat(coordMatches[2])]
    } else {
      let houseNo, street, city, postalCode
      let addressFragments = (location || "").split("\n")
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
      return await getLocation(
        houseNo || "",
        street || "",
        city || "",
        postalCode || "",
      )
    }
  }

  useEffect(() => {
    let mapContainer = document.getElementById("delivery-map")
    mapContainer.innerHTML = ""

    const map = new Map({
      target: "delivery-map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: CENTER_SRI_LANKA,
        zoom: 8,
      }),
    })

    ;(async () => {
      for (let delivery of myPendingDeliveries?.body || []) {
        const coords = await getCoords(delivery.deliveryAddress)
        const marker = new Feature({
          geometry: new Point(coords || [0, 0]),
        })
        marker.setStyle(pendingMarkerStyle)
        vectorSource.addFeature(marker)
      }
    })()
    ;(async () => {
      for (let delivery of myOngoingDeliveries?.body || []) {
        const coords = await getCoords(delivery.deliveryAddress)
        const marker = new Feature({
          geometry: new Point(coords || [0, 0]),
        })
        marker.setStyle(ongoingMarkerStyle)
        vectorSource.addFeature(marker)
      }
    })()
    ;(async () => {
      for (let delivery of unassignedDeliveries?.body || []) {
        const coords = await getCoords(delivery.deliveryAddress)
        const marker = new Feature({
          geometry: new Point(coords || [0, 0]),
        })
        marker.setStyle(unassignedMarkerStyle)
        vectorSource.addFeature(marker)
      }
    })()

    map.addLayer(vectorLayer)
  }, [myPendingDeliveries, myOngoingDeliveries, unassignedDeliveries])

  return (
    <div>
      <div className="delivery-map-pins">
        <div>
          <img src="/images/ongoing-pin.png" />
          My ongoing deliveries
        </div>
        <div>
          <img src="/images/pending-pin.png" />
          My pending deliveries
        </div>
        <div>
          <img src="/images/unassigned-pin.png" />
          My unassigned deliveries
        </div>
      </div>
      <div
        id="delivery-map"
        style={{
          width: "-webkit-fill-available",
          height: "calc(100% - (150px))",
          position: "absolute",
        }}
      />
    </div>
  )
}
