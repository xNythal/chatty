import type { Request, Response } from 'express'
import User from '../models/user.model'
import Message from '../models/message.model'
import type { QueryFilter } from 'mongoose'
import mongoose from 'mongoose'
import cloudinary from '../lib/cloudinary'

export async function getUsersForSidebar(req: Request, res: Response) {
  try {
    const loggedInUserID = req.user?._id
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserID },
    }).select('-password')
    return res.json(filteredUsers)
  } catch (error) {
    console.log('Error in getUsersForSidebar controller:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { id: userToChatID } = req.params
    if (typeof userToChatID !== 'string')
      return res.status(400).json({ message: 'ID has to be of type string.' })
    const senderID = req.user?._id
    const senderObjectID = new mongoose.Types.ObjectId(senderID)
    const receiverObjectID = new mongoose.Types.ObjectId(userToChatID)
    const messages = await Message.find({
      $or: [
        { senderID: senderObjectID, receiverID: receiverObjectID },
        { senderID: receiverObjectID, receiverID: senderObjectID },
      ],
    })
  } catch (error) {}
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { text, image } = req.body
    const { id: receiverID } = req.params
    const senderID = req.user?._id
    let imageURL
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageURL = uploadResponse.secure_url
    }
    const newMessage = new Message({
      senderID,
      receiverID,
      text,
      image: imageURL,
    })
    await newMessage.save()
    // todo: realtime functionality
    res.status(201).json(newMessage)
  } catch (error) {
    console.log('Error in sendMessage controller:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
