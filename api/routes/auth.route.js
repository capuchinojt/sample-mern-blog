import express from 'express'

import { signIn, signUp } from '../controllers/auth.controller.js'

const router = express.Router()

// api/auth/signup
router.post('/signup', signUp)

// api/auth/signin
router.post('/signin', signIn)

export default router