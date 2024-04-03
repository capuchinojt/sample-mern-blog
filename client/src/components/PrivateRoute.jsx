import { useUserInfo } from "@/services/redux/userAuth/userAuthSelector"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute = () => {
  const currentUser = useUserInfo()
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
}
