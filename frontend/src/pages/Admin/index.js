import TabMenu from "../../components/TabMenu"
import TabItem from "../../components/TabMenu/TabItem"

export default function Admin() {
  return (
    <TabMenu>
      <TabItem name="Inventory" element={<></>} />
      <TabItem name="User management" element={<></>} />
      <TabItem name="Supply management" element={<></>} />
      <TabItem name="Sales management" element={<></>} />
    </TabMenu>
  )
}
