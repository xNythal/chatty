import express from 'express'
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import dotenv from 'dotenv'
import { connectDB } from './lib/db'
import cookieParser from 'cookie-parser'
import { app, server } from './lib/socket'
dotenv.config()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/message', messageRoutes)

server.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`)
  connectDB()
})
