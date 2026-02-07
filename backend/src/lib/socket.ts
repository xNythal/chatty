import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: 'localhost:5173' } })

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg)
  })
  console.log('a user connected', socket.id)
})

export { io, app, server }
