import { Button } from "flowbite-react"
import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'

import { InputField } from "../components/InputField"
import { useDispatch } from "react-redux"
import { addNewUser } from "../features/signUp/signUpSlice"


export default function SignUp() {
  const {register, handleSubmit} = useForm()
  const dispatch = useDispatch()

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
            <InputField id="username" label="Your Username" type="text" registerControl={register('username')} />
            <InputField id="email" label="Your Email" type="text" registerControl={register('email')} />
            <InputField id="password" label="Your Password" type="password" registerControl={register('password')} />
            <Button gradientDuoTone='purpleToPink' type="submit">
              Sign Up
            </Button>
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
