import { useForm } from "react-hook-form"
import { Alert, Button, Spinner } from "flowbite-react"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch } from "react-redux"

import { InputField } from "@/components/InputField"
import { setUserInfo } from "@/services/redux/userAuth/userAuthSlice"
import { app } from "@/firebase"
import { ModalConfirm } from "./ModalConfirm"
import { useUserInfo } from "@/services/redux/userAuth/userAuthSelector"
import { useMutation } from "@tanstack/react-query"
import { updateUserInfoById } from "@/api/authApi"

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
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [dataToUpdate, setDataToUpdate] = useState(null)
  const [isDataChange, setIsDataChange] = useState(false)
  const [error, setError] = useState(null)
  const [isShowAlert, setIsShowAlert] = useState(false)
  const filePickerRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    imageFile && uploadImage()
  }, [imageFile])

  const updateUserInfoMutation = useMutation({
    mutationFn: (data) => updateUserInfoById(data),
    onSuccess: (data) => {
      dispatch(setUserInfo(data))
      setIsDataChange(false)
      setIsShowAlert(true)
    },
    onError: (res) => {
      console.error('signIn error: ', res)
      setError(res?.response?.data || res)
      setIsDataChange(false)
      setIsShowAlert(true)
    }
  })
  const { isPending, isSuccess, isError } = updateUserInfoMutation

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadProgress(progress.toFixed(0))
      },
      // When upload failed
      () => {
        setImageFileUploadError("Image upload failed. Image's size must be less than 2MB.")
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
        })
      }
    )
  }

  const handleOpenModal = (toggleOpenValue) => {
    setIsOpenModal(toggleOpenValue)
  }

  const handleUpdateUserInfo = () => {
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
    console.log('Dash Profile: ', data)
    if (checkDataChange(data)) {
      setDataToUpdate(data)
      setIsOpenModal(true)
    }
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
    setIsShowAlert(false)
    if (data.trim()) {
      setIsDataChange(true)
    }
  }

  return (
    currentUser && (
      <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        { isOpenModal && <ModalConfirm isOpenModal toggleModalFunc={handleOpenModal} updateUserInfoFunc={handleUpdateUserInfo}/>}
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
          <Button disabled={!isDataChange || isPending} type="submit" gradientDuoTone="purpleToBlue" outline>
            {
              isPending ? <>
                <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
              </> : 'Update'
            }
          </Button>
        </form>
        {
          isShowAlert && (
            <div className="mt-3">
              {isError && <Alert color="failure" className="items-center text-center"><span className="font-bold">Update failed.</span><br/> { error?.message ? error.message : 'Please check your details and try again.'}</Alert>}
              {isSuccess && <Alert color="success" className="items-center text-center"><span className="font-bold">Update successfully.</span><br/> Your changes have been successfully saved! </Alert>}
            </div>
          )
        }
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </div>
    )
  )
}
