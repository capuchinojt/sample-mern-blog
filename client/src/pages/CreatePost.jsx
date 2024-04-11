import { useForm } from "react-hook-form"
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useMutation } from '@tanstack/react-query'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import * as yup from 'yup'
import _ from 'lodash'

import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react";
import { createPostRequest } from "@/api/postApi"

export const CreatePost = () => {
  const postSchema = yup.object({
    title: yup.string().required()
  })
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
    resolver: yupResolver(postSchema)
  })

  useEffect(() => {
    register('editorContent', { required: true })
  }, [register])

  const [notificationContent, setNotificationContent] = useState(null)

  const createPostMutation = useMutation({
    mutationFn: (postData) => createPostRequest(postData),
    onSuccess: (response) => {
      setNotificationContent(response?.data?.message)
    },
    onError: (response) => {
      setNotificationContent(response?.data?.message)
    }
  })

  const onContentChange = (contentInput) => {
    setValue('editorContent', contentInput)
  }

  const onSubmit = (data) => {
    const postData = {
      title: data.title,
      category: data.category,
      content: data.editorContent
    }
    createPostMutation.mutate(postData)
  }

  const editorContent = watch('editorContent')

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
          <FileInput type="file" accept="image/*"/>
          <Button type="button" gradientDuoTone='purpleToBlue' size='sm'>Upload File</Button>
        </div>
        <ReactQuill theme="snow" value={editorContent} placeholder="Write something..." className="h-72 mb-12" onChange={onContentChange} />
        <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>
        {
          notificationContent && (
            <Alert color="success" onDismiss={() => alert('Alert dismissed!')}>
              <span className="font-medium">Successfull!</span> {notificationContent}
            </Alert>
          )
        }
      </form>
    </div>
  )
}