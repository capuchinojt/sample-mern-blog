import { useForm } from "react-hook-form"
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import * as yup from 'yup'
import _ from 'lodash'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useMemo, useState } from "react";
import { getPostRequest, updatePostRequest } from "@/api/postApi"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "@/firebase"
import { messageType } from "@/constant/status.constants"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { useParams } from "react-router-dom"

export const UpdatePost = () => {
  const postSchema = yup.object({
    title: yup.string().required(),
    image: yup.string()
  })
  const {register, handleSubmit, setValue, getValues, watch, formState: {errors}} = useForm({
    resolver: yupResolver(postSchema)
  })
  const { postId } = useParams()

  useEffect(() => {
    register('editorContent', { required: true })
    register('image')
  }, [register])

  const [notificationContent, setNotificationContent] = useState(null)
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const currentUser = userInfoStore(state => state.userInfo)
  const {isLoading, isError, data} = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostRequest(postId)
  })

  const postInfo = useMemo(() => {
    if (data?.data) {
      return data?.data?.posts[0]
    }
    return {}
  }, [data])

  const setValueToInputFields = (data) => {
    if (data) {
      setValue('category', data.category)
      setValue('image', data.image)
      setValue('title', data.title)
      setValue('editorContent', data.content)
    }
  }
  
  useEffect(() => {
    if (postInfo) {
      setValueToInputFields(postInfo)
    }
  }, [postInfo])

  const updatePostMutation = useMutation({
    mutationFn: (postData) => updatePostRequest(postData),
    onSuccess: (response) => {
      setValueToInputFields(response?.data?.data || {})
      setNotificationContent({
        apiType: 'updatePost',
        messageType: messageType.SUCCESS,
        message: 'Update post successfully.'
      })
    },
    onError: () => {
      setNotificationContent({
        apiType: 'updatePost',
        messageType: messageType.FAILURE,
        message: 'Update post failed.'
      })
    }
  })

  const onContentChange = (contentInput) => {
    setValue('editorContent', contentInput)
  }

  const onSubmit = (data) => {
    const postData = {
      userId: currentUser._id,
      postId,
      title: data.title,
      category: data.category,
      content: data.editorContent,
      ...(data?.image && { image: data.image })
    }
    updatePostMutation.mutate(postData)
  }

  if (isLoading || updatePostMutation.isLoading) {
    return 'Loading...'
  }

  if (isError) {
    return 'Error when updating post...'
  }

  if (!data || data.status !== 200) {
    return 'No data found...'
  }

  const editorContent = watch('editorContent')

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setNotificationContent({
          apiType: 'imageUpload',
          messageType: messageType.FAILURE,
          message: 'Please select an image.'
        })
        return
      }
      setNotificationContent(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageUploadProgress(null)
          setFile(null)
          setNotificationContent({
            apiType: 'imageUpload',
            messageType: messageType.FAILURE,
            message: 'Image upload failed. Please try again.'
          })
          console.log('Image uploadTask error:: ', error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null)
            setFile(null)
            setNotificationContent({
              apiType: 'imageUpload',
              messageType: messageType.SUCCESS,
              message: 'Image upload successfully.'
            })
            setValue('image', downloadURL)
          })
        }
      )
    } catch (error) {
      setFile(null)
      setImageUploadProgress(null)
      setNotificationContent({
        apiType: 'imageUpload',
        messageType: messageType.FAILURE,
        message: 'Image upload error.'
      })
      console.log('Image upload error:: ', error)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput className='flex-1' type="text" placeholder={_.capitalize(errors['title']?.message) || 'Title'} {...register('title')} color={errors['title']?.message ? messageType.FAILURE : undefined} />
          <Select {...register('category')}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 border-4 items-center justify-between border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
          {
            getValues['image'] && (
              <img src={getValues['image']} alt="upload" className="w-full h-72 object-cover" />
            )
          }
          <Button type="button" gradientDuoTone='purpleToBlue' size='sm' onClick={handleUploadImage} disabled={imageUploadProgress} outline>
            {
              imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>
              ) : 'Upload File'
            }
          </Button>
        </div>
        {
          notificationContent?.apiType === 'imageUpload' && (
            <Alert color={notificationContent?.messageType} onDismiss={() => setNotificationContent(null)}>
              <span className="font-medium">{notificationContent?.messageType === messageType.FAILURE ? 'Error!!' : 'Successfull!'}</span> {notificationContent?.message || 'We encountered an issue while updating your content. Please try again. '}
            </Alert>
          )
        }
        <ReactQuill theme="snow" value={editorContent} placeholder="Write something..." className="h-72 mb-12" onChange={onContentChange} />
        <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>
        {
          notificationContent?.apiType === 'updatePost' && (
            <Alert color={notificationContent?.messageType} onDismiss={() => setNotificationContent(null)}>
              <span className="font-medium">{notificationContent?.messageType === messageType.FAILURE ? 'Error!!' : 'Successfull!'}</span> {notificationContent?.message || 'We encountered an issue while updating your content. Please try again. '}
            </Alert>
          )
        }
      </form>
    </div>
  )
}