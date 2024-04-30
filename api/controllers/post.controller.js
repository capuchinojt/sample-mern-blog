import { query } from "express"
import { ERROR_CODES } from "../constant/errorStatus.constant.js"
import Post from "../models/post.model.js"
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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1
    const conditions = buildQueryCondition(req.query)
    const posts = await PostModel.find(conditions)
                                 .sort({ updatedAt: sortDirection })
                                 .skip(startIndex)
                                 .limit(limit)
    const postCount = posts.length
    
    const totalPosts = await PostModel.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPosts = await PostModel.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })

    res.status(200).json({
      posts,
      postCount,
      totalPosts,
      lastMonthPosts
    })
  } catch (error) {
    console.error('Error get post::', error.message)
    next(errorHandler(ERROR_CODES.BAD_REQUEST, 'An error occurred while get posts.'))
  }
}

const buildQueryCondition = (query) => {
  let conditions = {};
  if (query?.userId) conditions.userId = query.userId;
  if (query?.category) conditions.category = query.category;
  if (query?.slug) conditions.slug = query.slug;
  if (query?.postId) conditions._id = query.postId;
  if (query?.searchTerm) {
      conditions.$or = [
          { title: { $regex: query.searchTerm, $options: 'i' } },
          { content: { $regex: query.searchTerm, $options: 'i' } }
      ];
  }
  return conditions;
}
