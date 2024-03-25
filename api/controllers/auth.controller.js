import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import UserModel from '../models/user.model.js'
import { errorHandler } from '../utils/error.handle.js'

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body
  console.log('signUp', req.body)
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(500, 'All fields are required.'))
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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body
  console.log('signIn: ', req.body)

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required.'))
  }

  try {
    const validUser = await UserModel.findOne({ email })
    if (!validUser) {
      return next(errorHandler(404, 'User not found.'))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password.'))
    } else {
      const { password, ...rest } = validUser._doc
      const token = jwt.sign(
        { id: validUser.id },
        process.env.JWT_SECRET_KEY,
        // { expiresIn: '1d'}
      )

      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json(rest)
    }
  } catch(error) {
    next(error)
  }
}

export const signInWithGoogle = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body
  console.log('signIn: ', req.body)

  try {
    const validUser = await UserModel.findOne({ email })
    if (validUser) {
      const { password, ...rest } = validUser._doc
      const token = jwt.sign(
        { id: validUser.id },
        process.env.JWT_SECRET_KEY,
      )

      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json(rest)
    } else {
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(tempPassword, 10)
      const newUser = new UserModel({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-5),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      })
      await newUser.save()
      const { password, ...rest } = newUser._doc
      const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET_KEY,
      )

      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json(rest)
    }
  } catch(error) {
    next(error)
  }
}
