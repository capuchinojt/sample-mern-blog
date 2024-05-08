import { ERROR_CODES } from "../constant/errorStatus.constant.js"
import PostModel from "../models/post.model.js"
import { errorHandler } from "../utils/error.handle.js"
import moment from "moment-timezone"
import { createResponse } from "../utils/responseHelper.js"

export const getAllPost = async (req, res) => {
  const posts = await PostModel.find()
  res.status(200).json(posts)
}

export const createPost = async (req, res, next) => {
  try {
    if (!req?.user.id || !req?.user.isAdmin) {
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

export const getPosts = async (req, res, next) => {
  try {
    const { startIndex = 0, limit = 9, order = 'desc' } = req.query
    const sortDirection = order === 'asc' ? 1 : -1
    const conditions = buildQueryCondition(req.query)

    const [posts, totalPosts] = await Promise.all([
      PostModel.find(conditions)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      PostModel.countDocuments({
        conditions
      }),
    ])

    const postCount = posts.length
    const oneMonthAgo = moment().subtract(1, 'months').toDate()
    const lastMonthPosts = await PostModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
      posts,
      postCount,
      totalPosts,
      lastMonthPosts,
    })
  } catch (error) {
    console.error('Error getting posts:', error.message)
    next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while getting posts.'))
  }
}

export const deletePost = async (req, res, next) => {
  if (req?.user.id !== req.params.userId) {
    return next(errorHandler(ERROR_CODES.FORBIDDEN, 'You are not allowed to delete post.'))
  }

  if (!req.params?.postId) {
    return next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while delete posts.'))
  }

  try {
    await PostModel.findByIdAndDelete(req.params.postId)
    return res.status(200).json(createResponse({
      success: true,
      message: 'Detele post successfully.'
    }))
  } catch (error) {
    console.error('Error delete post:', error.message)
    next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while delete posts.'))
  }
}

export const updatePost = async (req, res, next) => {
  if (req?.user.id !== req.params.userId) {
    return next(errorHandler(ERROR_CODES.FORBIDDEN, 'You are not allowed to update post.'))
  }

  if (!req.params.postId) {
    return next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while update posts.'))
  }

  try {
    const postUpdated = await PostModel.findByIdAndUpdate(req.params.postId, {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image
      }
    }, { new: true })
    res.status(200).json(createResponse({
      success: true,
      data: postUpdated,
      message: 'Update post successfully.'
    }))
  } catch (error) {
    console.error('Error update post::', error.message)
    next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while update post.'))
  }
}

const buildQueryCondition = (query) => {
  let conditions = {}
  if (query?.userId) conditions.userId = query.userId
  if (query?.category) conditions.category = query.category
  if (query?.slug) conditions.slug = query.slug
  if (query?.postId) conditions._id = query.postId
  if (query?.searchTerm) {
      conditions.$or = [
          { title: { $regex: query.searchTerm, $options: 'i' } },
          { content: { $regex: query.searchTerm, $options: 'i' } }
      ]
  }
  return conditions
}
