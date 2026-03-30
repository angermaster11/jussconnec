import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      maxlength: 5000,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'emoji'],
      default: 'text',
    },
    media: {
      url: String,
      publicId: String,
      fileName: String,
      fileSize: Number,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedForEveryone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Helper to generate conversation ID from two user IDs
messageSchema.statics.getConversationId = function (userId1, userId2) {
  return [userId1, userId2].sort().join('_');
};

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
