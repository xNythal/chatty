import { HydratedDocument, type InferSchemaType } from 'mongoose'
import User from './models/user.model'

type UserType = InferSchemaType<typeof User.schema>

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserType>
    }
  }
}
