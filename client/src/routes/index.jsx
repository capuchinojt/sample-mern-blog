import About from "../pages/About"
import Dashboard from "../pages/Dashboard"
import Home from "../pages/Home"
import Projects from "../pages/Projects"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"

export const pages = [
  {path: '/', element:<Home />},
  {path: '/about', element:<About />},
  {path: '/sign-in', element:<SignIn />},
  {path: '/sign-up', element:<SignUp />},
  {path: '/dashboard', element:<Dashboard />},
  {path: '/projects', element:<Projects />},
]
