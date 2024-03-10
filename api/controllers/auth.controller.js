import bcryptjs from 'bcryptjs'
import UserModel from '../models/user.model.js'
import { errorHandler } from '../utils/error.handle.js'

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body
  console.log(req.body)
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(500, 'All fields are required!!'))
  }

  const passwordHash = bcryptjs.hashSync(password, 10)

  const newUser = new UserModel({
    username, email, password: passwordHash
  })
  
  try {
    await newUser.save()
    return res.status(200).json('Sign up successful!!')
  } catch (error) {
    next(error)
  }
}