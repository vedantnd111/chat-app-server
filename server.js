const express = require("express");
require("dotenv").config();
const app = express();
const http = require("http");
const routes = require('./router');
const cors = require("cors");
const { addUsers, removeUser, getUser, getUsersInRoom } = require('./operations');

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

// const socket = io(server);

io.on("connection", (socket) => {
    console.log("new user connection!!");
    socket.on("join", ({ name, room }, cb) => {
        const { error, user } = addUsers({ id: socket.id, name, room });
        if (error) return cb(error);
        socket.emit('message', { user: 'admin', text: `Hello ${user.name} welcome to the room ${user.room}!!` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        // socket.brodcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} is in the room!` })
        socket.join(user.room);
        cb();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id); 
        io.to(user.room).emit('message', { user: user.name, text: message });
        callback();
      });
    
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left the room!` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});
app.use(cors());
app.use("/", routes);

const port = process.env.PORT || 5000;
server.listen(process.env.PORT, () => {
    console.log("connected to port: " + port);
});