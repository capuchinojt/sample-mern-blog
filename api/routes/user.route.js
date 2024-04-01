import express from 'express'
import { getUserInfo, updateUserInfo } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.handle.js'

const router = express.Router()

// /api/v1/user/info
router.get('/info', getUserInfo)

// /api/v1/user/update/:userId
router.put('/update/:userId', verifyToken, updateUserInfo)


export default router