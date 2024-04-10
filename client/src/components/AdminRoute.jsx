import { userInfoStore } from "@/services/zustandStore/userStore"
import { Navigate, Outlet } from "react-router-dom"

export const AdminRoute = () => {
  const currentUser = userInfoStore(state => state.userInfo)
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />
}
