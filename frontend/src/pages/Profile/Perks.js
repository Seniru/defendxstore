import Perk from "../../components/Perk"
import { useAuth } from "../../contexts/AuthProvider"
import useFetch from "../../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

export default function Perks() {
  const { token } = useAuth()
  const [perks] = useFetch(`${REACT_APP_API_URL}/api/perks`, { body: [] })

  return (
    <>
      {perks?.body?.map((perk) => (
        <Perk
          key={perk.id}
          image={`${REACT_APP_API_URL}/${perk.image}`}
          title={perk.title}
          description={perk.description}
          progress={{ progress: 1, max: perk.maxProgress }}
          reward={perk.rewardText}
        />
      ))}
    </>
  )
}
