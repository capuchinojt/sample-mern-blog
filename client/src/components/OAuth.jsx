import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

import { app } from "@/firebase"
import { useMutation } from "@tanstack/react-query"
import { signInWithGoogleRequest } from "@/api/authApi"
import { userInfoStore } from "@/services/zustandStore/userStore"

export const OAuth = () => {
  const setUserInfo = userInfoStore(state => state.setUserInfo)
  const mutationSignInWithGoogle = useMutation({
    mutationFn: (data) => signInWithGoogleRequest(data),
    onSuccess: async (res) => {
      console.log('mutationSignInWithGoogle', res)
      setUserInfo(res)
    }
  })

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
        mutationSignInWithGoogle.mutate(userInfo)
      }
      console.info('resultFromGoogleAuth', resultFromGoogleAuth)
    } catch (error) {
      console.error('signup with google error: ', error)
    }
  }

  return (
    <Button disabled={mutationSignInWithGoogle.isPending} type="button" gradientDuoTone='pinkToOrange' outline onClick={handleGoogleAuthClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}
