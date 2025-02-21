import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Components from "./pages/Components"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="components" element={<Components />} />
          </Route>
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
