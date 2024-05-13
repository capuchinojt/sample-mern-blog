import { deleteData, fetchData } from "@/lib/api"

export const getUsersRequest = async (reqData) => {
  console.log('getUsersRequest:: ', { reqData })  
  const params = new URLSearchParams(reqData).toString()
  const response = await fetchData(`/api/v1/user/getUsers?${params}`)
  return response
}

export const deleteUserByAdmin = async (reqData) => {
  console.log('getUsersRequest:: ', { reqData })
  const response = await deleteData(`/api/v1/user/admin/delete/${reqData.userId}`)
  return response
}
