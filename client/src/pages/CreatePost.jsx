import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Alert, Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react'
import { CircularProgressbar } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css'
import { useMutation } from '@tanstack/react-query'
import ReactQuill from "react-quill"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import 'react-quill/dist/quill.snow.css'
import * as yup from 'yup'
import _ from 'lodash'
import { yupResolver } from "@hookform/resolvers/yup"

import { createPostRequest } from "@/api/postApi"
import { app } from "@/firebase"
import { messageType } from "@/constant/status.constants"

export const CreatePost = () => {
  const [file, setFile] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const postSchema = yup.object({
    title: yup.string().required()
  })
  const {register, handleSubmit, setValue, getValues, watch, formState: {errors}} = useForm({
    resolver: yupResolver(postSchema)
  })

  useEffect(() => {
    register('editorContent', { required: true }),
    register('image')
  }, [register])

  const [notificationContent, setNotificationContent] = useState(null)

  const createPostMutation = useMutation({
    mutationFn: (postData) => createPostRequest(postData),
    onSuccess: (response) => {
      setNotificationContent({
        type: messageType.success,
        message: response?.data?.message
      })
    },
    onError: (response) => {
      setNotificationContent({
        type: messageType.failure,
        message: response?.data?.message
      })
    }
  })

  const onContentChange = (contentInput) => {
    setValue('editorContent', contentInput)
  }

  const onSubmit = (data) => {
    const postData = {
      title: data.title,
      category: data.category,
      content: data.editorContent,
      image: getValues('image')
    }
    createPostMutation.mutate(postData)
  }

  const editorContent = watch('editorContent')

  const handleuUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError('Please select your image file.')
        return
      }
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed',
        (snapshot) => {
          setImageFileUploading(true)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageFileUploadProgress(progress.toFixed(0))
        },
        // When upload failed
        (error) => {
          setImageUploadError("Image upload failed. Image's size must be less than 2MB")
          setImageFileUploadProgress(null)
          setFile(null)
          setImageFileUploading(false)
          console.log('Image upload failed:: ', error)
        },
        () => {
          // When upload succeeded
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null)
            setImageUploadError(null)
            setValue('image', downloadURL)
          })
        }
      )
    } catch (error) {
      setImageUploadError('Image upload failed')
      setImageFileUploadProgress(null)
      console.log('Image upload failed:: ', error)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput className='flex-1' type="text" placeholder={_.capitalize(errors['title']?.message) || 'Title'} {...register('title')} color={errors['title']?.message ? 'failure' : undefined} />
          <Select {...register('category')}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 border-4 items-center justify-between border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.value[0])} />
          {
            imageUploadError && (
              <Alert color='failure' onDismiss={() => alert('Alert dismissed!')}>
                <span className="font-medium">Error!</span> {imageUploadError}
              </Alert>
            )
          }
          <Button type="button" disabled={imageFileUploadProgress || imageFileUploading} gradientDuoTone='purpleToBlue' size='sm' onClick={handleuUploadImage}>
            {
              imageFileUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress || 0}%`} />
                </div>
              ) : 'Upload File'
            }
          </Button>
        </div>
        <ReactQuill theme="snow" value={editorContent} placeholder="Write something..." className="h-72 mb-12" onChange={onContentChange} />
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={createPostMutation.isPending}>
          { 
            createPostMutation.isPending || imageFileUploading ? <>
              <Spinner size='sm' />
                <span className="pl-3">Loading...</span>
            </> : 'Publish'
          }
        </Button>
        {
          notificationContent && (
            <Alert color={notificationContent.type} onDismiss={() => alert('Alert dismissed!')}>
              <span className="font-medium">Successfull!</span> {notificationContent.message}
            </Alert>
          )
        }
      </form>
    </div>
  )
}