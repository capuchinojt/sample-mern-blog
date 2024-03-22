import About from "@/pages/About"
import Dashboard from "@/pages/Dashboard"
import Home from "@/pages/Home"
import Projects from "@/pages/Projects"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"

export const pages = [
  {path: '/', element:<Home />, key: 'Home'},
  {path: '/about', element:<About />, key: 'About'},
  {path: '/sign-in', element:<SignIn />, key: 'signIn'},
  {path: '/sign-up', element:<SignUp />, key: 'signUp'},
  {path: '/dashboard', element:<Dashboard />, key: 'dashboard'},
  {path: '/projects', element:<Projects />, key: 'projects'},
]
