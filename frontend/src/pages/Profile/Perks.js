import Perk from "../../components/Perk"

export default function Perks() {
  return (
    <>
      <Perk
        image="https://cdn4.kongcdn.com/badge_icons/0000/5553/swords_souls_easy.jpg"
        title="Crazy shopper"
        description="Shop 10 times"
        progress={{ progress: 5, max: 12 }}
        reward="5% OFF promotion code"
      />
      <Perk
        image="https://cdn4.kongcdn.com/badge_icons/0000/5553/swords_souls_easy.jpg"
        title="Community hero"
        description="Receive 100 hearts from the community to a forum thread you created"
        progress={{ progress: 5, max: 100 }}
        reward="15% OFF promotion code"
      />
    </>
  )
}
