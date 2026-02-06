import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import type { NextFunction, Request, Response } from 'express'
import type { TokenPayload } from '../lib/types'

export async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'No token was provided.' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Token is invalid or has expired.' })
    }
    const user = await User.findById(decoded.userID).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    console.log('Error in protectRoute middleware:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}
