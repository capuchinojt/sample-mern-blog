import { useForm } from "react-hook-form"
import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import * as yup from 'yup'

import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect } from "react";

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

  const onContentChange = (contentInput) => {
    setValue('editorContent', contentInput)
  }

  const onSubmit = (data) => {
    console.log(data)
  }

  const editorContent = watch('editorContent')

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput className='flex-1' type="text" placeholder="Title" {...register('title')} />
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
        <Button type="submit" onClick={handleSubmit(onSubmit)} gradientDuoTone="purpleToPink">Publish</Button>
      </form>
    </div>
  )
}