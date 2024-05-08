import express from 'express'
import { createPost, deletePost, getPosts, updatePost } from '../controllers/post.controller.js'
import { verifyToken } from '../utils/verifyUser.handle.js'

const router = express.Router()

// api/post/create
router.post('/create', verifyToken, createPost)

// api/post/getPosts
router.get('/getPosts', getPosts)

// api/post/deletePost
router.delete('/deletePost/:userId/:postId', verifyToken, deletePost)

// api/post/updatePost
router.put('/updatePost/:userId/:postId', verifyToken, updatePost)

export default router