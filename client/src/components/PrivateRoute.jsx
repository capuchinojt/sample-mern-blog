import { userInfoStore } from "@/services/zustandStore/userStore"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute = () => {
  const currentUser = userInfoStore(state => state.userInfo)
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
}
