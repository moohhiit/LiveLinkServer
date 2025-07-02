import express from "express"
import messageModel from "../models/Message.js";
import auth from "../middleware/auth.js";



const ChatRoute = express.Router();

ChatRoute.use(auth);

ChatRoute.get('/:userId', async (req, res) => {
  const messages = await messageModel.find({ userId: req.params.userId });
  res.json(messages);
});

ChatRoute.post('/:userId', async (req, res) => {
  const { text ,to} = req.body;
  const message = new messageModel({
    userId: req.params.userId,
    sender: req.user.email,
    text,
    reciver: to
  });
  await message.save();
  res.status(201).json(message);
});

export default ChatRoute;
