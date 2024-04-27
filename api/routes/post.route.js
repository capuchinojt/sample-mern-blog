import express from 'express'
import { createPost, getPosts } from '../controllers/post.controller.js'
import { verifyToken } from '../utils/verifyUser.handle.js'

const router = express.Router()

router.post('/create', verifyToken, createPost)
router.get('/getPosts', getPosts)

export default router