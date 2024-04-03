import { useSelector } from "react-redux";

export const useUserInfo = () => {
  const userInfo = useSelector(state => state.userAuth.userInfo)
  return userInfo
}
