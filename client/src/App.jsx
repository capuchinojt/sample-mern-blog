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
import { lazy, Suspense } from "react"

const About = lazy(() => import("@/pages/About"))
const SignInLazy = lazy(() => import("@/pages/SignIn"))
const SignUpLazy = lazy(() => import("@/pages/SignUp"))

export default function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {
          pages.map((page) => (
            <Route {...page} key={page.key} />
          ))
        }
        <Route
          path="/about"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SignInLazy />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SignUpLazy />
            </Suspense>
          }
        />
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
  );
}