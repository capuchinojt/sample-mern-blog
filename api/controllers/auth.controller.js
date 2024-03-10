import bcryptjs from 'bcryptjs'
import UserModel from '../models/user.model.js'

export const signUp = async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return res.status(500).json('All fields are required!!')
  }

  const passwordHash = bcryptjs.hashSync(password, 10)

  const newUser = new UserModel({
    username, email, password: passwordHash
  })
  
  try {
    await newUser.save()
    return res.status(200).json('Sign up successful!!')
  } catch (error) {
    return res.status(500).json(`Error: ${error.message}`)
  }
}