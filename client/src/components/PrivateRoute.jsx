import { useUserInfo } from "@/services/redux/signIn/signInSelector"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute = () => {
  const currentUser = useUserInfo()
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
}
