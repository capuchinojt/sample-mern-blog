import bcryptjs from 'bcryptjs'

import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.handle.js"
import { validateEmail } from '../utils/commonLib.js'

export const getUserInfo = (req, res) => {
  res.json({ message: 'Welcome to user route'})
}

export const updateUserInfo = async (req, res, next) => {
  console.log('updateUserInfo', req.user)
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update.'))
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters.'))
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10)
  }
  if (req.body.username) {
    const username = req.body.username.toLowerCase()
    if (username.length < 7 || username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters.'))
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, 'Username can not contain spaces.'))
    }
    if (!username.match(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username must contain both letters and numbers.'));
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.params.userId) {
        return next(errorHandler(400, 'Username is already taken.'));
    }

    req.body.username = username; // Cập nhật username đã được xử lý
  }
  if (req.body.email) {
    const email = req.body.email
    if (!validateEmail(email)) {
      return next(errorHandler(400, 'Email is not valid.'))
    }

    const existingUserByEmail = await User.findOne({ email }).select('_id')
    console.log('existingUserByEmail: ', existingUserByEmail)
    if (existingUserByEmail && existingUserByEmail._id.toString() !== req.params.userId) {
      return next(errorHandler(400, 'Email is already in use.'))
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePicture: req.body.profilePicture
      }
    }, { new: true }).select('-password')
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user info:', error)
    next(error)
  }
}
