import TabMenu from "../../components/TabMenu"
import TabItem from "../../components/TabMenu/TabItem"
import UserManagement from "./UserManagement"
import SupplyManagement from "./SupplyManagement"
import SalesManagement from "./SalesManagement"

export default function Admin() {
  return (
    <TabMenu>
      <TabItem name="Inventory" element={<></>} />
      <TabItem name="User management" element={<UserManagement />} />
      <TabItem name="Supply management" element={<SupplyManagement />} />
      <TabItem name="Sales management" element={<SalesManagement/>} />
    </TabMenu>
  )
}
