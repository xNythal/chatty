import type { Request, RequestHandler, Response } from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils'
import cloudinary from '../lib/cloudinary'

export async function signup(req: Request, res: Response) {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters.' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res
        .status(409)
        .json({ message: 'User with this email already exists.' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      res.cookie(
        'token',
        generateToken(newUser._id, email, newUser.profilePic),
        {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV !== 'development',
        },
      )
      await newUser.save()
      res.status(201).json({
        id: newUser._id,
        fullName,
        email,
        profilePic: newUser.profilePic,
      })
    } else {
      res.status(400).json({ message: 'Invalid user data.' })
    }
  } catch (error) {
    console.log('Error in signup controller:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }
    const token = generateToken(user._id, email, user.profilePic)
    res.cookie('token', token, {
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({
      id: user._id,
      fullName: user.fullName,
      email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log('Error in login controller:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export function logout(req: Request, res: Response) {
  try {
    res.clearCookie('token', { maxAge: 0 })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export async function updateProfile(req: Request, res: Response) {
  const { profilePic } = req.body
  try {
    const userID = req.user?._id
    if (!profilePic) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true },
    )
    res.json({
      profilePic: updatedUser?.profilePic,
    })
  } catch (error) {
    console.log('Error in updateProfile controller:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export function checkAuth(req: Request, res: Response) {
  try {
    res.json(req.user)
  } catch (error) {
    console.log('Error in checkAuth controller:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
