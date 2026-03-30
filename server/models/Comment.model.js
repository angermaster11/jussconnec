import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
