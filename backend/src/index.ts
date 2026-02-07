import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import { connectDB } from './lib/db'
import cookieParser from 'cookie-parser'
import { app, server } from './lib/socket'
import cors from 'cors'

const PORT = process.env.PORT

app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use('/auth', authRoutes)
app.use('/messages', messageRoutes)

server.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`)
  connectDB()
})
