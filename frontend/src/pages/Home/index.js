import React, { useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import "./slider.css"
import "./home.css"
import Productcard from "../../components/Productcard"
import pic1 from "../../assets/images/sliderImages/pic1.jpg"
import pic2 from "../../assets/images/sliderImages/pic2.jpg"
import pic3 from "../../assets/images/sliderImages/pic3.jpg"
import pic4 from "../../assets/images/sliderImages/pic4.jpg"
import pic5 from "../../assets/images/sliderImages/pic5.jpg"
import shoes from "../../assets/images/shoes.jpg"
import last from "../../assets/images/last.jpg"
import white from "../../assets/images/white.jpg"
import pro1 from "../../assets/images/pro1.png"
import pro2 from "../../assets/images/pro2.png"
import pro3 from "../../assets/images/pro3.png"
import useFetch from "../../hooks/useFetch"
import { useAuth } from "../../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

const Home = () => {
  const { user } = useAuth()
  const [items] = useFetch(`${REACT_APP_API_URL}/api/items`, { body: [] })
  const [trendingItems] = useFetch(`${REACT_APP_API_URL}/api/items/trending`, {
    body: [],
  })
  const [recommendedItems] = useFetch(
    `${REACT_APP_API_URL}/api/items/recommended`,
    {
      body: [],
    },
  )

  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")

  const filteredItems = useMemo(() => {
    if (!searchQuery || !items?.body) return []

    const query = searchQuery.toLowerCase()
    return items.body.filter(
      (item) =>
        item.itemName?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        (Array.isArray(item.colors) &&
          item.colors.some((color) => color.toLowerCase().includes(query))),
    )
  }, [items?.body, searchQuery])

  useEffect(() => {
    const swiper = new window.Swiper(".mySwiper", {
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 3000, // Autoplay
      },
      loop: true,
    })
  }, [])

  return (
    <div className="main-container">
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: "calc(100vw - 15px)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontWeight: "bold",
            animation: "marquee 20s linear infinite",
            fontSize: "20px",
          }}
        >
          Get 20% OFF for your First Order by Using #DEFEND1 PROMO CODE🔥
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; FREE Delivery available for the
          Orders above 5000LKR up to 20th of April. &nbsp;&nbsp;&nbsp; &nbsp;
        </div>
      </div>

      <style>
        {`
    @keyframes marquee {
      from { transform: translateX(100%); }
      to { transform: translateX(-100%); }
    }
  `}
      </style>

      <section className="carousel-section">
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src={pic1} alt="Slide 1" />
            </div>

            <div className="swiper-slide">
              <img src={pic2} alt="Slide 2" />
            </div>

            <div className="swiper-slide">
              <img src={pic3} alt="Slide 3" />
            </div>
            <div className="swiper-slide">
              <img src={pic4} alt="Slide 4" />
            </div>
            <div className="swiper-slide">
              <img src={pic5} alt="Slide 5" />
            </div>
          </div>

          <div className="swiper-pagination"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </section>

      {user && (
        <div className="popular">
          <h3>
            Recommended <span className="secondary-text">Items</span>{" "}
          </h3>
          <div className="catalog">
            {recommendedItems.body?.map((item, index) => (
              <Productcard
                itemName={item.itemName}
                category={item.category}
                price={item.price}
                product={item.product}
                id={item._id}
                key={index}
              />
            ))}
          </div>
        </div>
      )}

      <div className="popular">
        <h3>
          Trending <span className="secondary-text">Products</span>
        </h3>
        <div className="catalog">
          {trendingItems?.body?.map((item, index) => (
            <Productcard
              itemName={item.itemName}
              category={item.category}
              price={item.price}
              product={item.product}
              id={item._id}
              key={index}
            />
          ))}
        </div>
      </div>

      <br />
      <div className="popular">
        <h3>Categories</h3>
        <div className="img-container">
          <img
            src={shoes}
            style={{
              height: "200px",
              width: "400px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            alt="Shoes category"
          />
          <img
            src={last}
            style={{
              height: "200px",
              width: "400px",
              borderRadius: "20px",
              cursor: "pointer",
              marginLeft: "50px",
            }}
            alt="Last category"
          />
          <img
            src={white}
            style={{
              height: "200px",
              width: "400px",
              borderRadius: "20px",
              cursor: "pointer",
              marginLeft: "50px",
            }}
            alt="White category"
          />
        </div>
      </div>

      <br />

      <div className="popular">
        <h3>
          All <span className="secondary-text">Products</span>
          {searchQuery && (
            <span className="secondary-text">
              {" "}
              - Search results for "{searchQuery}"
            </span>
          )}
        </h3>
        <div className="catalog">
          {searchQuery && filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <Productcard
                itemName={item.itemName}
                category={item.category}
                price={item.price}
                product={item.product}
                id={item._id}
                key={index}
              />
            ))
          ) : searchQuery && filteredItems.length === 0 ? (
            <div className="no-results">
              <p>
                No products found matching your search. Try different keywords.
              </p>
            </div>
          ) : (
            items?.body?.map((item, index) => (
              <Productcard
                itemName={item.itemName}
                category={item.category}
                price={item.price}
                product={item.product}
                id={item._id}
                key={index}
              />
            ))
          )}
        </div>
      </div>

      <div className="popular">
        <h3>
          Customer <span style={{ color: "grey" }}>feedbacks</span>
        </h3>
        <div className="feedback">
          <div className="feedback-card">
            <div className="profile">
              <div className="profile-pic">
                <img src={pro1} alt="Profile 1" />
              </div>
              <h3>Malindu Pabasara</h3>
            </div>
            <p style={{ fontStyle: "italic", fontSize: "18px" }}>
              "Best active wear 💯 I've ever bought! 😊"
            </p>
            <div className="rating">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
          </div>
          <div className="feedback-card">
            <div className="profile">
              <div className="profile-pic">
                <img src={pro2} alt="Profile 2" />
              </div>
              <h3>Seniru Pasan</h3>
            </div>
            <p style={{ fontStyle: "italic", fontSize: "18px" }}>
              "DefendX has the most comfy material for relax tees.tbh 🥰."
            </p>
            <div className="rating">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
          </div>
          <div className="feedback-card">
            <div className="profile">
              <div className="profile-pic">
                <img src={pro3} alt="Profile 3" />
              </div>
              <h3>Supun Perera</h3>
            </div>
            <p style={{ fontStyle: "italic", fontSize: "18px" }}>
              "Fast delivery and great customer service!💙.Love this vibe 👍"
            </p>
            <div className="rating">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
