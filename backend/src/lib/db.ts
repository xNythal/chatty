import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    console.log('MONGODB connected successfully!', conn.connection.host)
  } catch (error) {
    console.log('Error while connecting to MONGODB:', error)
  }
}
