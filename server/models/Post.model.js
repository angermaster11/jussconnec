import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      maxlength: 3000,
    },
    postType: {
      type: String,
      enum: ['text', 'image', 'video', 'article', 'poll', 'document', 'repost'],
      default: 'text',
    },
    media: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video', 'document'] },
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public',
    },
    hashtags: [{ type: String, trim: true, lowercase: true }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    taggedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: String,

    // Reactions
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: {
          type: String,
          enum: ['like', 'love', 'insightful', 'celebrate', 'curious'],
        },
      },
    ],
    reactionsCount: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      insightful: { type: Number, default: 0 },
      celebrate: { type: Number, default: 0 },
      curious: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    commentsCount: { type: Number, default: 0 },
    repostsCount: { type: Number, default: 0 },
    savesCount: { type: Number, default: 0 },

    // Repost reference
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    repostComment: String,

    // Poll (if postType is 'poll')
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
          votesCount: { type: Number, default: 0 },
        },
      ],
      endsAt: Date,
      totalVotes: { type: Number, default: 0 },
    },

    isEdited: { type: Boolean, default: false },
    editedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ 'reactions.user': 1 });
postSchema.index({ content: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
