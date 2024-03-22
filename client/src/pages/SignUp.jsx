import { Alert, Button, Spinner } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as yup from 'yup'

import { InputField } from "@/components/InputField"
import { addNewUser } from "@/services/redux/signUp/signUpSlice" 
import { STATUS_SUCCEEDED } from "@/services/constant/status.constants"

const userInfoSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required()
})


export default function SignUp() {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(userInfoSchema)
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const result = useSelector(state => state.signUp)
  const {loading, error, status} = result
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(loading)
    if (status === STATUS_SUCCEEDED) {
      navigate('/sign-in')
    }
  }, [loading, status])

  const onSubmit = data => {
    console.table('data: ', data)
    dispatch(addNewUser(data))
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left sidebar */}
        <div className="flex-1">
          <Link
            to="/"
            className="whitespace-nowrap text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-lg text-white">
              CapuchinoJT{"'"}s
            </span>{" "}
            <span className="text-black">Blog</span>
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>
        {/* right sidebar */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField id="username" label="Your Username" type="text" registerControl={register('username')} errors={errors} />
            <InputField id="email" label="Your Email" type="text" registerControl={register('email')} errors={errors} />
            <InputField id="password" label="Your Password" type="password" registerControl={register('password')} errors={errors} />
            <Button gradientDuoTone='purpleToPink' type="submit" disabled={isLoading}>
              {
                isLoading ? <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                </> : 'Sign Up'
              }
            </Button>
            {error && <Alert color="failure" className="items-center text-center"><span className="font-bold">Sign-up failed.</span><br/> Please check your details and try again.</Alert>}
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
