import { useForm } from "react-hook-form"
import { Button } from "flowbite-react"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

import { InputField } from "@/components/InputField"
import { useUserInfo } from "@/services/redux/signIn/signInSelector"

const userInfoSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string()
})

export const DashProfile = () => {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(userInfoSchema)
  })
  const currentUser = useUserInfo()

  const onSubmit = (data) => {
    console.log('Dash Profile: ', data)
  }

  return (
    currentUser && (
      <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-32 h-32 self-center cursor-pointer shadow-sm overflow-hidden rounded-full">
            <img src={currentUser.profilePicture} alt='Profile Picture' className="rounded-full w-full h-full  object-cover border-8 border-[lightgray]" />
          </div>
          <InputField id="username" type="text" registerControl={register('username')} errors={errors} defaultValue={currentUser.username} />
          <InputField id="email" type="text" registerControl={register('email')} errors={errors} defaultValue={currentUser.email} />
          <InputField id="password" type="password" registerControl={register('password')} errors={errors} placeholder="Password" />
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Update
          </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </div>
    )
  )
}
