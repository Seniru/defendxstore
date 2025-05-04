import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Components from "./pages/Components"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { AuthProvider } from "./contexts/AuthProvider"
import PrivateRoute from "./components/PrivateRoute"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"
import NotFound from "./pages/errors/NotFound"
import Ticket from "./pages/Ticket"
import Support from "./pages/Support"
import Home from "./pages/Home"
import Product from "./pages/Product"
import Forum from "./pages/Forum"
import ForumThread from "./pages/ForumThread"
import CreateTicket from "./pages/Ticket/CreateTicket"
import CreateForum from "./pages/Forum/createForum"
import PromoCodes from "./pages/Admin/promocodes"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Invoice from "./pages/Invoice"
import { CartProvider } from "./contexts/CartProvider"
import Verify from "./pages/Verify"
import FAQ from "./pages/FAQ"
import DeliveryDashboard from "./pages/DeliveryDashboard"
import SupportDashboard from "./pages/SupportDashboard"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="components" element={<Components />} />
                <Route path="product" element={<Product />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="forum">
                  <Route index element={<Forum />} />
                  <Route path="thread" element={<ForumThread />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="invoice" element={<Invoice />} />
                  <Route path="ticket" element={<Ticket />} />
                  <Route path="ticket/new" element={<CreateTicket />} />
                  <Route path="forum">
                    <Route path="thread/new" element={<CreateForum />} />
                    <Route path="thread/edit" element={<CreateForum />} />
                  </Route>
                  <Route path="support" element={<Support />} />
                  <Route path="verify" element={<Verify />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route element={<PrivateRoute requiredRole="SUPPORT_AGENT" />}>
                  <Route
                    path="support/dashboard"
                    element={<SupportDashboard />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route element={<PrivateRoute requiredRole="DELIVERY_AGENT" />}>
                  <Route
                    path="delivery/dashboard"
                    element={<DeliveryDashboard />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route element={<PrivateRoute requiredRole="USER" />}>
                  <Route path="admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
              <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  )
}

export default App
