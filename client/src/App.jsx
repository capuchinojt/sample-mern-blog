import { BrowserRouter, Route, Routes } from "react-router-dom"

import { pages } from "./routes"
import Header from "./components/Header"
import { FooterPage } from "./components/Footer"
import { PrivateRoute } from "./components/PrivateRoute"
import Dashboard from "./pages/Dashboard"
import { AdminRoute } from "./components/AdminRoute"
import { CreatePost } from "./pages/CreatePost"
import { UpdatePost } from "./pages/UpdatePost"
import { ScrollToTop } from "./components/ScrollToTop"

export default function App() {

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        {
          // eslint-disable-next-line react/jsx-key
          pages.map((page) => <Route {...page} key={page.key}/>)
        }
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterPage />
    </BrowserRouter>
  )
}