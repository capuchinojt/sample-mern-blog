import { useDispatch, useSelector } from "react-redux"
import { Alert, Button, Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { STATUS_SUCCEEDED } from "@/constant/status.constants"
import { InputField } from "@/components/InputField"
import { signInRequest } from "@/services/redux/signIn/signInSlice"
import { OAuth } from "@/components/OAuth"

const userInfoSignInSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
})

export default function SignIn() {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(userInfoSignInSchema)
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const {loading, error, status}  = useSelector(state => state.signIn)

  useEffect(() => {
    setIsLoading(loading)
    if (status === STATUS_SUCCEEDED && !error) {
      navigate('/')
    }
  }, [loading, status])

  const onSubmit = data => {
    console.table('data: ', data)
    dispatch(signInRequest(data))
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
            <OAuth />
            {error && <Alert color="failure" className="items-center text-center"><span className="font-bold">Sign-up failed.</span> {error?.message ? error.message : "Please check your details."}</Alert>}
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
