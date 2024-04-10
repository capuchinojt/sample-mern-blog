import { useForm } from "react-hook-form"
import { Alert, Button, Spinner } from "flowbite-react"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useMutation } from "@tanstack/react-query"
import { app } from "@/firebase"
import 'react-circular-progressbar/dist/styles.css'
import { Link, useNavigate } from "react-router-dom"

import { InputField } from "@/components/InputField"
import { ModalConfirm } from "@/components/ModalConfirm"
import { deleteUserById, updateUserInfoById } from "@/api/authApi"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { useSignOut } from "@/services/hooks/useSignOut.hook"

const userInfoSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string()
})

export const DashProfile = () => {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(userInfoSchema)
  })
  const navigate = useNavigate()
  const currentUser = userInfoStore(state => state.userInfo)
  const setUserInfo = userInfoStore(state => state.setUserInfo)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isDataChange, setIsDataChange] = useState(false)
  const filePickerRef = useRef()
  const [currentNotification, setCurrentNotification] = useState(null)
  const [modalContent, setModalContent] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const { signOutMutation } = useSignOut(
    () => {
      setUserInfo(null)
      navigate('/sign-in')
    },
    (res) => {
      setCurrentNotification({
        type: 'failure',
        message: res.data.message
      })
    }
  )

  useEffect(() => {
    imageFile && uploadImage()
  }, [imageFile])

  const updateUserInfoMutation = useMutation({
    mutationFn: (data) => updateUserInfoById(data),
    onSuccess: (data) => {
      setUserInfo(data)
      setIsDataChange(false)
      setImageFileUploadProgress(null)
      setCurrentNotification({
        type: 'success',
        message: 'Update successfully. Your changes have been successfully saved!'
      })
    },
    onError: (res) => {
      const errorMessage = (res?.response?.data || res).message
      setCurrentNotification({
        type: 'failure',
        message: `Update failed. ${errorMessage || 'Please check your details and try again.'}`
      })
      setIsDataChange(false)
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUserById(userId),
    onSuccess: () => {
      setUserInfo(null)
      navigate('/sign-in')
    },
    onError: (res) => {
      setCurrentNotification({
        type: 'failure',
        message: res.data.message
      })
    }
  })

  const uploadImage = async () => {
    console.info('Uploading image...')
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read; 
    //       allow write: if
    //       request.resource.size < 2* 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    const storage = getStorage(app)
    const fileName = new Date().getTime() + '-' + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on('state_changed',
      (snapshot) => {
        setImageFileUploading(true)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadProgress(progress.toFixed(0))
      },
      // When upload failed
      () => {
        setImageFileUploadError("Image upload failed. Image's size must be less than 2MB.")
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
          setImageFileUploading(false)
        })
      }
    )
  }

  const handleOpenModal = (toggleOpenValue) => {
    setIsOpenModal(toggleOpenValue)
  }

  const handleUpdateUserInfo = (dataToUpdate) => {
    const userIdToUpdate = currentUser?._id
    if (userIdToUpdate && dataToUpdate) {
      const data = {
        userId: currentUser?._id,
        userInfo: {
          ...dataToUpdate,
          ...(imageFileUrl ? { profilePicture: imageFileUrl } : {})
        }
      }
      updateUserInfoMutation.mutate(data)
    }
  }

  const handleImageChange = (e) => {
    const eleFile = e.target.files[0]
    if (eleFile) {
      setImageFileUploadError(null)
      setImageFile(eleFile)
      setImageFileUrl(URL.createObjectURL(eleFile))
      setIsDataChange(true)
    }
  }

  const checkDataChange = (dataInput) => {
    if (dataInput) {
      const { username, email, password} = dataInput
      if (username !== currentUser.username || email !== currentUser.email || password.trim().length > 0 || (imageFileUrl && currentUser.profilePicture !== imageFileUrl)) {
        return true
      }
    }
    return false
  }

  const onSubmit = (data) => {
    if (checkDataChange(data)) {
      handleOpenModalConfirm(() => handleUpdateUserInfo(data))
    }
  }

  const handleOpenModalConfirm = (onConfirmFuc, messageConfirm) => {
    setModalContent({
      onConfirmFuc: onConfirmFuc, messageConfirm
    })
    setIsOpenModal(true)
  }

  const renderCircularProgressBar = (percentage) => {
    return (
      <CircularProgressbar
        value={percentage}
        text={percentage && `${percentage}%`}
        strokeWidth={5}
        styles={{
          // Customize the root svg element
          root: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          },
          // Customize the path, i.e. the "completed progress"
          path: {
            // Path color
            stroke: `rgba(62, 152, 199, ${percentage / 100})`,
          },
          // Customize the text
          text: {
            fontSize: '16px',
            fontWeight: 'bold',
          },
        }}
      />
    )
  }

  const checkChangeData = (data) => {
    setCurrentNotification(null)
    if (data.trim()) {
      setIsDataChange(true)
    }
  }

  const handleDeleteUser = () => {
    handleOpenModalConfirm(() => deleteUserMutation.mutate(currentUser?._id), "Are you sure you want to delete your account?")
  }

  const handleSignOut = () => {
    signOutMutation.mutate()
  }

  return (
    currentUser && (
      <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <ModalConfirm isOpenModal={isOpenModal} toggleModalFunc={handleOpenModal} onConfirmFuc={modalContent?.onConfirmFuc} messageConfirm={modalContent?.messageConfirm}/>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-32 h-32 self-center cursor-pointer shadow-sm overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgress && renderCircularProgressBar(imageFileUploadProgress)}
            <img src={imageFileUrl || currentUser.profilePicture} alt='ProfilePic' className={`rounded-full w-full h-full  object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
          </div>
          { imageFileUploadError && (<Alert color='failure'> <span className="font-semibold">{imageFileUploadError}</span> </Alert>) }
          <input type="file" hidden accept="image/*" ref={filePickerRef} onChange={handleImageChange} />
          <InputField handleChangeData={checkChangeData} id="username" type="text" registerControl={register('username')} errors={errors} defaultValue={currentUser.username} />
          <InputField handleChangeData={checkChangeData} id="email" type="text" registerControl={register('email')} errors={errors} defaultValue={currentUser.email} />
          <InputField handleChangeData={checkChangeData} id="password" type="password" registerControl={register('password')} errors={errors} placeholder="Password" />
          <Button disabled={!isDataChange || updateUserInfoMutation.isPending || imageFileUploading} type="submit" gradientDuoTone="purpleToBlue" outline>
            {
              updateUserInfoMutation.isPending || imageFileUploading ? <>
                <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
              </> : 'Update'
            }
          </Button>
          {
            currentUser.isAdmin && (
              <Link to="/create-post">
                <Button className="w-full" gradientDuoTone="purpleToPink">Create a post</Button>
              </Link>
            )
          }
        </form>
        {
          currentNotification && (
            <div className="mt-3">
              <Alert color={currentNotification?.type} className="items-center text-center">
                {currentNotification?.message}
              </Alert>
            </div>
          )
        }
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
          <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
        </div>
      </div>
    )
  )
}
