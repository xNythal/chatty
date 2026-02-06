import jwt from 'jsonwebtoken'
import type { Types } from 'mongoose'

export function generateToken(
  userID: Types.ObjectId,
  email: string,
  profilePic: string,
) {
  const token = jwt.sign(
    { userID, email, profilePic },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
    },
  )
  return token
}
