import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Components from "./pages/Components"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="components" element={<Components />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
