import mongoose from 'mongoose';

const readReceiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  readAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sentAt: { type: Date, default: Date.now },
  readBy: [readReceiptSchema]
});

export default mongoose.model('Message', messageSchema);