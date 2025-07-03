import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import { createServer } from 'node:http';
import { Server } from 'socket.io';



import AuthRoute from "../routes/AuthRoute.js"
import ChatRoute from "../routes/ChatRoute.js"


dotenv.config()


const app = express();
const PORT = process.env.PORT;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


app.use(cors())

let connectedUsers = []
io.on('connection', (socket) => {
  console.log('client connected:', socket.id);


  socket.on("register-user", (username) => {
    let userdata = { id: socket.id, username: username }
    connectedUsers.push(userdata)
    io.emit("update-users", connectedUsers);
  });

  socket.on('private_message', ({ from, to, message }) => {
    console.log("Message Recive" , from , to , message)

    if (to) {
      io.to(to).emit('private_message', {
        to,
        from,
        message,
        timestamp: Date.now(),
      });
      console.log("Message Send to private user ")
    }
  });

  socket.on('message_seen', ({ senderId }) => {
    const senderSocketId = users[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit('message_seen_ack', {
        seen: true,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id)
    io.emit("update-users", connectedUsers);
  });
});


app.use(express.json())

app.use('/api/auth', AuthRoute)
app.use('/api/chat', ChatRoute)



mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');

}).catch(err => console.error('MongoDB error:', err));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));