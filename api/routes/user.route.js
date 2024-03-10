import express from 'express'
import { getUserInfo } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/info', getUserInfo)

export default router