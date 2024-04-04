import { postData, updateData } from "@/lib/api"

export const signInRequest = async (userInfo) => {
  const response = await postData('/api/auth/signIn', userInfo)
  return response
}

export const signInWithGoogleRequest = async (userInfo) => {
  const response = await postData('/api/auth/signInWithGoogle', userInfo)
  return response
}

export const signUp = async (userInfo) => {
  const response = await postData('/api/auth/signup', userInfo)
  console.table('signUp/addNewUser', userInfo, response)
  return response
}

export const updateUserInfoById = async ({userId, userInfo}) => {
  const response = await updateData(`/api/v1/user/update/${userId}`, userInfo)
  return response
}
