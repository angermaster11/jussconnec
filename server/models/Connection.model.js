import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    note: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — one request per pair
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
connectionSchema.index({ recipient: 1, status: 1 });

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;
