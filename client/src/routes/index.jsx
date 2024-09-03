import Home from "@/pages/Home"
import { PostPage } from "@/pages/PostPage"
import Projects from "@/pages/Projects"

export const pages = [
  {path: '/', element:<Home />, key: 'Home'},
  {path: '/projects', element:<Projects />, key: 'Projects'},
  {path: "/post/:postSlug", element:<PostPage />, key: 'PostPage'}
]
