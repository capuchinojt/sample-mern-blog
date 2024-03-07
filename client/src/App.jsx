import { BrowserRouter, Route, Routes } from "react-router-dom"

import { pages } from "./routes"
import Header from "./components/Header"

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
    </BrowserRouter>
  )
}