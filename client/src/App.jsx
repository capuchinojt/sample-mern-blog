import { BrowserRouter, Route, Routes } from "react-router-dom"

import { pages } from "./routes"
import Header from "./components/Header"
import { FooterPage } from "./components/Footer"

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {
          // eslint-disable-next-line react/jsx-key
          pages.map((page) => <Route {...page}/>)
        }
      </Routes>
      <FooterPage />
    </BrowserRouter>
  )
}