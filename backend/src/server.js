require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

require('./database/connectDB');

const routes = require('./routes.js')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const connectedUsers = {}

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)
    const { user } = socket.handshake.query

    connectedUsers[user] = socket.id
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers
    return next()
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.json()); //Apenas formato json
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

server.listen(3333)
