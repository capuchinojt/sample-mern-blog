import bcryptjs from 'bcryptjs'

import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.handle.js"
import { validateEmail } from '../utils/commonLib.js'

const logger = (action, details) => {
  console.log(`[${new Date().toISOString()}] ${action}:`, JSON.stringify(details, null, 2))
}

export const getUserInfo = (req, res) => {
  res.json({ message: 'Welcome to user route'})
}

const validateAndUpdateField = async (field, value, userId, validationFn) => {
  if (value) {
    await validationFn(value, userId)
    return value
  }
  return null
}

const validatePassword = async (password) => {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
  return await bcryptjs.hash(password, 10)
}

const validateUsername = async (username, userId) => {
  username = username.toLowerCase()
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
  if (existingUser && existingUser._id.toString() !== userId) {
    throw new Error('Username is already taken.')
  }
}

const validateEmailField = async (email, userId) => {
  if (!validateEmail(email)) {
    throw new Error('Email is not valid.')
  }

  const existingUserByEmail = await User.findOne({ email }).select('_id')
  if (existingUserByEmail && existingUserByEmail._id.toString() !== userId) {
    throw new Error('Email is already in use.')
  }
}

export const getUsers = async (req, res, next) => {
  if (!req?.user?.isAdmin) {
    logger('Access Denied', { userId: req?.user?.id, action: 'getUsers' })
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

    logger('Users Retrieved', { count: userList.length, totalUser, totalOfLastMonthUser })
    return res.status(200).json({
      users: userList,
      totalUser,
      totalOfLastMonthUser
    })
  } catch (error) {
    logger('Error getUsers', { error: error.message })
    next(errorHandler(400, error.message))
  }
}

export const updateUserInfo = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      logger('Unauthorized Update Attempt', { attemptedBy: req.user.id, targetUser: req.params.userId })
      return next(errorHandler(403, 'You are not allowed to update.'))
    }

    const updateFields = {
      password: await validateAndUpdateField('password', req.body.password, req.params.userId, validatePassword),
      username: await validateAndUpdateField('username', req.body.username, req.params.userId, validateUsername),
      email: await validateAndUpdateField('email', req.body.email, req.params.userId, validateEmailField),
      profilePicture: req.body.profilePicture
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: Object.fromEntries(Object.entries(updateFields).filter(([_, v]) => v != null)) },
      { new: true }
    ).select('-password')

    logger('User Updated', { userId: req.params.userId, updatedFields: Object.keys(updateFields) })
    res.status(200).json(updatedUser)
  } catch (error) {
    logger('Error Updating User', { userId: req.params.userId, error: error.message })
    next(errorHandler(400, error.message))
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      logger('Unauthorized Delete Attempt', { attemptedBy: req.user.id, targetUser: req.params.userId })
      return next(errorHandler(403, 'You are not allowed to delete.'))
    }

    const userToDelete = await User.findByIdAndDelete(req.params.userId)
    if (!userToDelete) {
      logger('User Not Found for Deletion', { userId: req.params.userId })
      return next(errorHandler(404, 'User not found.'))
    }
    logger('User Deleted', { userId: req.params.userId })
    res.status(200).json('User has been deleted.')
  } catch (error) {
    logger('Error Deleting User', { userId: req.params.userId, error: error.message })
    next(errorHandler(400, error.message))
  }
}

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      logger('Non-Admin Delete Attempt', { attemptedBy: req.user.id, targetUser: req.params.userId })
      return next(errorHandler(403, 'You are not allowed to delete user.'))
    }

    if (req.user.id === req.params.userId) {
      logger('Admin Self-Delete Attempt', { adminId: req.user.id })
      return next(errorHandler(403, 'You can not delete yourself.'))
    }

    const userToDelete = await User.findByIdAndDelete(req.params.userId)
    if (!userToDelete) {
      logger('User Not Found for Admin Deletion', { userId: req.params.userId })
      return next(errorHandler(404, 'User not found.'))
    }
    logger('User Deleted by Admin', { deletedUserId: req.params.userId, adminId: req.user.id })
    res.status(200).json('User has been deleted by admin.')
  } catch (error) {
    logger('Error in Admin User Deletion', { targetUser: req.params.userId, adminId: req.user.id, error: error.message })
    next(errorHandler(400, error.message))
  }
}

export const signOut = async (req, res, next) => {
  try {
    logger('User Sign Out', { userId: req.user })
    res.clearCookie('access_token').status(200).json({message: "User has been signed out!"})
  } catch (error) {
    logger('Error Signing Out', { userId: req.user.id, error: error.message })
    next(errorHandler(400, error.message))
  }
}