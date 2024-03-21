import { BrowserRouter, Route, Routes } from "react-router-dom"

import { pages } from "./routes"
import Header from "./components/Header"
import { FooterPage } from "./components/Footer"
import { Flowbite } from "flowbite-react"

export default function App() {

  return (
    <BrowserRouter>
      <Flowbite>
        <Header />
        <Routes>
          {
            // eslint-disable-next-line react/jsx-key
            pages.map((page) => <Route {...page}/>)
          }
        </Routes>
        <FooterPage />
      </Flowbite>
    </BrowserRouter>
  )
}