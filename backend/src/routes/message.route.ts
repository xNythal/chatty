import express from 'express'
import { protectRoute } from '../middlewares/auth.middleeware'
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from '../controllers/message.controller'

const router = express.Router()

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/:id', protectRoute, sendMessage)

export default router
