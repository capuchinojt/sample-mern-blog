import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from "react-redux"

import { app } from "@/firebase"
import { signInWithGoogleRequest } from "@/services/redux/signIn/signInSlice"

export const OAuth = () => {
  const dispatch = useDispatch()

  const handleGoogleAuthClick = async () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const resultFromGoogleAuth = await signInWithPopup(auth, provider)
      if (resultFromGoogleAuth?._tokenResponse) {
        const userInfo = {
          name: resultFromGoogleAuth.user.displayName,
          email: resultFromGoogleAuth.user.email,
          googlePhotoUrl: resultFromGoogleAuth.user.photoURL
        }
        dispatch(signInWithGoogleRequest(userInfo))
      }
      console.info('resultFromGoogleAuth', resultFromGoogleAuth)
    } catch (error) {
      console.error('signup with google error: ', error)
    }
  }

  return (
    <Button type="button" gradientDuoTone='pinkToOrange' outline onClick={handleGoogleAuthClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}
