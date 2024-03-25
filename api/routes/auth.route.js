import express from 'express'

import { signIn, signInWithGoogle, signUp } from '../controllers/auth.controller.js'

const router = express.Router()

// api/auth/signup
router.post('/signup', signUp)

// api/auth/signin
router.post('/signin', signIn)

// api/auth/signInWithGoogle
router.post('/signInWithGoogle', signInWithGoogle)

export default router