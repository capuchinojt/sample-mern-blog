import { useMutation } from '@tanstack/react-query'

import { signOut } from '@/api/authApi'

export const useSignOut = (handleOnSuccess, handleOnError) => {
  const signOutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      if (typeof handleOnSuccess === 'function') {
        handleOnSuccess()
      }
    },
    onError: (res) => {
      if (typeof handleOnError === 'function') {
        handleOnError(res)
      }
    }
  })

  return { signOutMutation }
}