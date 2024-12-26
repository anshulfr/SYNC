import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  joinLink: { type: String, unique: true, required: true }, // Add joinLink field
});

export default mongoose.model('ChatRoom', chatRoomSchema);