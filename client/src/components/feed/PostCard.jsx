import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal, Globe, Users, Lock,
  ThumbsUp, Lightbulb, PartyPopper, Sparkles, Send, Trash2, Flag, BookmarkCheck,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { reactToPost, deletePost, savePost } from '../../features/posts/postsSlice';
import { formatDate, truncateText, REACTION_EMOJIS } from '../../utils/helpers';

const reactionIcons = {
  like: { icon: ThumbsUp, color: 'text-blue-400', label: 'Like' },
  love: { icon: Heart, color: 'text-red-400', label: 'Love' },
  insightful: { icon: Lightbulb, color: 'text-yellow-400', label: 'Insightful' },
  celebrate: { icon: PartyPopper, color: 'text-green-400', label: 'Celebrate' },
  curious: { icon: Sparkles, color: 'text-purple-400', label: 'Curious' },
};

const PostCard = ({ post, onCommentClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOwner = user?._id === post.author?._id;
  const userReaction = post.reactions?.find((r) => r.user === user?._id);
  const isSaved = user?.savedPosts?.includes(post._id);
  const totalReactions = Object.values(post.reactionsCount || {}).reduce((a, b) => a + b, 0);

  const handleReaction = (type) => {
    dispatch(reactToPost({ postId: post._id, type }));
    setShowReactions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this post?')) {
      dispatch(deletePost(post._id));
    }
    setShowMenu(false);
  };

  const handleSave = () => {
    dispatch(savePost(post._id));
    setShowMenu(false);
  };

  const visibilityIcons = { public: Globe, connections: Users, private: Lock };
  const VisIcon = visibilityIcons[post.visibility] || Globe;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3 group">
            <Avatar src={post.author?.profilePicture} name={`${post.author?.firstName} ${post.author?.lastName}`} size="md" />
            <div>
              <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                {post.author?.firstName} {post.author?.lastName}
              </p>
              <p className="text-gray-500 text-xs">{post.author?.headline}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                <span>{formatDate(post.createdAt)}</span>
                <span>·</span>
                <VisIcon className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* Menu */}
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-10 w-48 bg-navy-800 border border-navy-700 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  <button onClick={handleSave}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-navy-700 transition-colors">
                    {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {isSaved ? 'Unsave' : 'Save Post'}
                  </button>
                  {isOwner && (
                    <button onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-navy-700 transition-colors">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  )}
                  {!isOwner && (
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-navy-700 transition-colors">
                      <Flag className="h-4 w-4" /> Report
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="mt-3">
            <p className="text-gray-200 text-sm whitespace-pre-wrap">
              {expanded ? post.content : truncateText(post.content, 300)}
            </p>
            {post.content.length > 300 && (
              <button onClick={() => setExpanded(!expanded)}
                className="text-primary text-sm hover:underline mt-1">
                {expanded ? 'Show less' : '...see more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className={`mt-3 ${post.media.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
          {post.media.map((m, i) => (
            <div key={i} className="bg-navy-800">
              {m.type === 'video' ? (
                <video src={m.url} controls className="w-full max-h-[500px] object-contain" />
              ) : (
                <img src={m.url} alt="" className="w-full max-h-[500px] object-contain" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Poll */}
      {post.postType === 'poll' && post.poll && (
        <div className="px-4 mt-3 space-y-2">
          {post.poll.options?.map((opt, i) => {
            const totalVotes = post.poll.options.reduce((a, o) => a + (o.votes || 0), 0);
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return (
              <div key={i} className="relative bg-navy-800 rounded-lg overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all" style={{ width: `${pct}%` }} />
                <div className="relative flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-gray-200">{opt.text}</span>
                  <span className="text-gray-400 font-medium">{pct}%</span>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-gray-500">
            {post.poll.options.reduce((a, o) => a + (o.votes || 0), 0)} votes
          </p>
        </div>
      )}

      {/* Stats Row */}
      {(totalReactions > 0 || post.commentsCount > 0) && (
        <div className="flex items-center justify-between px-4 py-2 mt-2 border-t border-navy-700/50">
          {totalReactions > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {Object.entries(post.reactionsCount || {})
                  .filter(([, v]) => v > 0)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([type]) => {
                    const { icon: Icon, color } = reactionIcons[type];
                    return <Icon key={type} className={`h-4 w-4 ${color}`} />;
                  })}
              </div>
              <span className="text-xs text-gray-400 ml-1">{totalReactions}</span>
            </div>
          )}
          {post.commentsCount > 0 && (
            <button onClick={() => onCommentClick?.(post._id)} className="text-xs text-gray-400 hover:text-primary hover:underline">
              {post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center border-t border-navy-700/50">
        {/* Reaction button with hover popup */}
        <div className="relative flex-1"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            onClick={() => handleReaction(userReaction?.type || 'like')}
            className={`flex items-center justify-center gap-2 w-full py-3 text-sm transition-colors ${
              userReaction ? reactionIcons[userReaction.type]?.color + ' font-medium' : 'text-gray-400 hover:bg-navy-700/50'
            }`}
          >
            {userReaction ? (
              <>
                {(() => { const { icon: Icon } = reactionIcons[userReaction.type]; return <Icon className="h-5 w-5" />; })()}
                {reactionIcons[userReaction.type]?.label}
              </>
            ) : (
              <>
                <ThumbsUp className="h-5 w-5" /> Like
              </>
            )}
          </button>
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-navy-800 border border-navy-700 rounded-full px-2 py-1.5 shadow-xl z-30"
              >
                {Object.entries(reactionIcons).map(([type, { icon: Icon, color, label }]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    title={label}
                    className={`p-1.5 rounded-full hover:bg-navy-700 transition-transform hover:scale-125 ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={() => onCommentClick?.(post._id)}
          className="flex items-center justify-center gap-2 flex-1 py-3 text-sm text-gray-400 hover:bg-navy-700/50 transition-colors">
          <MessageCircle className="h-5 w-5" /> Comment
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 py-3 text-sm text-gray-400 hover:bg-navy-700/50 transition-colors">
          <Repeat2 className="h-5 w-5" /> Repost
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 py-3 text-sm text-gray-400 hover:bg-navy-700/50 transition-colors">
          <Send className="h-5 w-5" /> Send
        </button>
      </div>
    </motion.article>
  );
};

export default PostCard;
