import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    senderID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true },
)

const Message = mongoose.model('Message', messageSchema)

export default Message
