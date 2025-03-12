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
import Home from "./pages/Home"
<<<<<<< HEAD
import Product from "./pages/Product"
=======
import Forum from "./pages/Forum"
import ForumThread from "./pages/ForumThread"
>>>>>>> 11e9aacba88885ffb71e2309cd7ed57c5d57a65b

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="components" element={<Components />} />
              <Route path="home" element={<Home />} />
              <Route path="product" element={< Product/>} />
=======
              <Route path="forum">
                <Route index element={<Forum />} />
                <Route path="thread" element={<ForumThread />} />
              </Route>
>>>>>>> 11e9aacba88885ffb71e2309cd7ed57c5d57a65b
              <Route element={<PrivateRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route element={<PrivateRoute requiredRole="SUPPORT_AGENT" />}>
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route element={<PrivateRoute requiredRole="DELIVERY_AGENT" />}>
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
      </AuthProvider>
    </div>
  )
}

export default App
