import express from 'express'
import { deleteUser, getUserInfo, signOut, updateUserInfo } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.handle.js'

const router = express.Router()

// /api/v1/user/info
router.get('/info', getUserInfo)

// /api/v1/user/update/:userId
router.put('/update/:userId', verifyToken, updateUserInfo)

// /api/v1/user/delete/:userId
router.delete('/delete/:userId', verifyToken, deleteUser)

// /api/v1/user/signout
router.post('/signout', signOut)

export default router