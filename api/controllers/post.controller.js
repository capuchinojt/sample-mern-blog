import { ERROR_CODES } from "../constant/errorStatus.constant.js"
import PostModel from "../models/post.model.js"
import { errorHandler } from "../utils/error.handle.js"

export const getAllPost = async (req, res) => {
  const posts = await PostModel.find()
  res.status(200).json(posts)
}

export const createPost = async (req, res, next) => {
  try {
    if (!req?.user || !req?.user.id || !req?.user.isAdmin) {
      return next(errorHandler(ERROR_CODES.FORBIDDEN, 'You are not allowed to create post.'))
    }

    if (!req.body?.title || !req.body?.title === '' || !req.body?.content || !req.body?.content === '' || !req.body?.category || !req.body?.category === '') {
      return next(errorHandler(ERROR_CODES.CONTENT_CANNOT_BE_EMPTY, 'All field for post is required.'))
    }

    const slug = req.body?.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
    const newPost = new PostModel({
      ...req.body,
      slug,
      userId: req.user.id
    })

    const savedPost = await newPost.save()
    res.status(200).json({
      message: 'Created post successfully.',
      post: savedPost
    })
  } catch (error) {
    console.error('Error creating post::', error.message)
    next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while creating post.'))
  }
}