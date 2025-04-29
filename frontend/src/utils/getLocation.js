const getLocation = async (houseNo, street, city, postalCode) => {
  houseNo = encodeURIComponent(houseNo.replace(/\s+/, "+"))
  street = encodeURIComponent(street.replace(/\s+/, "+"))
  city = encodeURIComponent(city.replace(/\s+/, "+"))
  postalCode = encodeURIComponent(postalCode)
  const country = "Sri+Lanka"

  // query arrays representing different levels. This is useful when the api can't
  // find addresses that has lower levels.
  const queries = [
    `street=${houseNo}&city=${city}&postalcode=${postalCode}&country=${country}`,
    `street=${street}&city=${city}&postalcode=${postalCode}&country=${country}`,
    `city=${city}&postalcode=${postalCode}&country=${country}`,
    `postalcode=${postalCode}&country=${country}`,
    `country=${country}`,
  ]

  for (let query of queries) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&${query}`
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DefendXStore/1.0 (senirupasan@gmail.com)",
      },
    })
    let data = await response.json()
    data = data.filter((location) => location.display_name.includes(postalCode))

    if (data.length > 0) {
      const { lon, lat } = data[0]
      return [parseFloat(lon), parseFloat(lat)]
    }
  }
}

export default getLocation
