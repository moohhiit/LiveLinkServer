import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  contactId: String,
  sender: String,
  reciver : String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const messageModel = mongoose.model('Message', MessageSchema);

export default messageModel
