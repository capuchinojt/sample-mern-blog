import { BrowserRouter, Route, Routes } from "react-router-dom"

import { pages } from "./routes"
import Header from "./components/Header"
import { FooterPage } from "./components/Footer"
import { PrivateRoute } from "./components/PrivateRoute"
import Dashboard from "./pages/Dashboard"

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {
          // eslint-disable-next-line react/jsx-key
          pages.map((page) => <Route {...page}/>)
        }
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterPage />
    </BrowserRouter>
  )
}