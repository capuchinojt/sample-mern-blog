import bcryptjs from 'bcryptjs'

import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.handle.js"
import { validateEmail } from '../utils/commonLib.js'

export const getUserInfo = (req, res) => {
  res.json({ message: 'Welcome to user route'})
}

const checkAndUpdatePassword = async (req) => {
  if (req.body.password) {
    if (req.body.password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    return await bcryptjs.hash(req.body.password, 10)
  }
  return null
}

const checkAndUpdateUsername = async (req) => {
  if (req.body.username) {
    const username = req.body.username.toLowerCase()
    if (username.length < 7 || username.length > 20) {
      throw new Error('Username must be between 7 and 20 characters.')
    }
    if (username.includes(" ")) {
      throw new Error('Username can not contain spaces.')
    }
    if (!username.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/)) {
      throw new Error('Username must contain both letters and numbers.')
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.params.userId) {
      throw new Error('Username is already taken.')
    }

    return username
  }
  return null
}

const checkEmail = async (req) => {
  if (req.body.email) {
    const email = req.body.email
    if (!validateEmail(email)) {
      throw new Error('Email is not valid.')
    }

    const existingUserByEmail = await User.findOne({ email }).select('_id')
    console.log('existingUserByEmail: ', existingUserByEmail)
    if (existingUserByEmail && existingUserByEmail._id.toString() !== req.params.userId) {
      throw new Error('Email is already in use.')
    }

    return email
  }
  return null
}

export const getUsers = async (req, res, next) => {
  if (!req?.user?.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update.'))
  }

  try {
    const startIndex = parseInt(req?.query?.startIndex || 0)
    const limit = parseInt(req?.query?.limit || 9)
    const sortDirection = req?.query?.sort === 'asc' ? 1 : -1

    const userList = await User.find()
                               .sort({ createdAt: sortDirection })
                               .skip(startIndex)
                               .limit(limit)
                               .select('-password')

    const totalUser = await User.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )
    const totalOfLastMonthUser = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })

    return res.status(200).json({
      users: userList,
      totalUser,
      totalOfLastMonthUser
    })
  } catch (error) {
    console.error('Error getUsers::', error)
    next(errorHandler(400, error.message))
  }
}

export const updateUserInfo = async (req, res, next) => {
  try {
    console.log('updateUserInfo', req.user)
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update.'))
    }
    const password = await checkAndUpdatePassword(req)
    const username = await checkAndUpdateUsername(req)
    const email = await checkEmail(req)

    const updateFields = {
      ...(password && { password }),
      ...(username && { username }),
      ...(email && { email }),
      ...req.body.profilePicture && { profilePicture: req.body.profilePicture }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: updateFields
    }, { new: true }).select('-password')
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user info:', error)
    next(errorHandler(400, error.message))
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    console.log('Delete user info:: ', req.user)
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete.'))
    }

    const userToDelete = await User.findById(req.params.userId)
    if (!userToDelete) {
      return next(errorHandler(403, 'User not found.'))
    }
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json('User has been deleted.')
  } catch (error) {
    console.error('Error updating user info:', error)
    next(errorHandler(400, error.message))
  }
}

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    console.log('Delete user info:: ', req.user)

    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete user.'))
    }

    if (req.user.id === req.params.userId) {
      return next(errorHandler(403, 'You can not delete yourself.'))
    }

    const userToDelete = await User.findById(req.params.userId)
    if (!userToDelete) {
      return next(errorHandler(403, 'User not found.'))
    }
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json('User has been deleted by admin.')
  } catch (error) {
    console.error('Error deleting user by admin::', error)
    next(errorHandler(400, error.message))
  }
}

export const signOut = async (req, res, next) => {
  try {
    console.log('Sign out', req.user)
    res.clearCookie('access_token').status(200).json({message: "User has been signed out!"})
  } catch (error) {
    console.error('Error sign out:', error)
    next(errorHandler(400, error.message))
  }
}