import { BrowserRouter, Route, Routes } from "react-router-dom"
import { pages } from "./routes"

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        {
          // eslint-disable-next-line react/jsx-key
          pages.map((page) => <Route {...page}/>)
        }
      </Routes>
    </BrowserRouter>
  )
}