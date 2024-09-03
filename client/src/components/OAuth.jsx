import { useNavigate } from 'react-router-dom'
import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
// Import Firebase authentication functions
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

// Import the Firebase app instance
import { app } from "@/firebase"
import { useMutation } from "@tanstack/react-query"
import { signInWithGoogleRequest } from "@/api/authApi"
import { userInfoStore } from "@/services/zustandStore/userStore"

export const OAuth = () => {
  const navigate = useNavigate()
  const setUserInfo = userInfoStore(state => state.setUserInfo)
  const mutationSignInWithGoogle = useMutation({
    mutationFn: (data) => signInWithGoogleRequest(data),
    onSuccess: async (res) => {
      console.log('mutationSignInWithGoogle', res)
      setUserInfo(res)
      navigate('/')
    }
  })

  const handleGoogleAuthClick = async () => {
    // Initialize Firebase Auth instance
    const auth = getAuth(app)
    // Create a new Google Auth Provider
    const provider = new GoogleAuthProvider()
    // Set custom parameters for the Google sign-in prompt
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      // Trigger Google sign-in popup and await the result
      const resultFromGoogleAuth = await signInWithPopup(auth, provider)
      if (resultFromGoogleAuth?._tokenResponse) {
        // Extract user information from the Google Auth result
        const userInfo = {
          name: resultFromGoogleAuth.user.displayName,
          email: resultFromGoogleAuth.user.email,
          googlePhotoUrl: resultFromGoogleAuth.user.photoURL
        }
        // Trigger the mutation to sign in with Google on the backend
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
