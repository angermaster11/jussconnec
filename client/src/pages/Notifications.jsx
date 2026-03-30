import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, UserPlus, Repeat2, ThumbsUp, AtSign, Bell, CheckCheck,
} from 'lucide-react';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { SkeletonCard } from '../components/common/Skeleton';
import {
  fetchNotifications, markAllRead, markAsRead,
} from '../features/notifications/notificationsSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { formatDate } from '../utils/helpers';

const typeConfig = {
  like: { icon: ThumbsUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  love: { icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
  comment: { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  connection_request: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  connection_accepted: { icon: UserPlus, color: 'text-green-400', bg: 'bg-green-400/10' },
  follow: { icon: UserPlus, color: 'text-accent', bg: 'bg-accent/10' },
  repost: { icon: Repeat2, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  mention: { icon: AtSign, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
};

const getMessage = (type, senderName) => {
  const msgs = {
    like: `${senderName} liked your post`,
    love: `${senderName} loved your post`,
    insightful: `${senderName} found your post insightful`,
    celebrate: `${senderName} celebrated your post`,
    curious: `${senderName} is curious about your post`,
    comment: `${senderName} commented on your post`,
    reply: `${senderName} replied to your comment`,
    connection_request: `${senderName} sent you a connection request`,
    connection_accepted: `${senderName} accepted your connection request`,
    follow: `${senderName} started following you`,
    repost: `${senderName} reposted your post`,
    mention: `${senderName} mentioned you`,
  };
  return msgs[type] || `${senderName} interacted with you`;
};

// Group by date
const groupByDate = (items) => {
  const groups = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  items.forEach((item) => {
    const date = new Date(item.createdAt).toDateString();
    let label;
    if (date === today) label = 'Today';
    else if (date === yesterday) label = 'Yesterday';
    else label = new Date(item.createdAt).toLocaleDateString('en', { month: 'long', day: 'numeric' });

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });
  return Object.entries(groups);
};

const Notifications = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, unreadCount, isLoading, pagination } = useSelector((state) => state.notifications);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination.hasMore) {
      dispatch(fetchNotifications({ cursor: pagination.cursor }));
    }
  }, [dispatch, isLoading, pagination.hasMore, pagination.cursor]);

  const lastRef = useInfiniteScroll(loadMore, isLoading);

  useEffect(() => {
    dispatch(fetchNotifications({}));
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleClick = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification._id));
    }
  };

  const grouped = groupByDate(items);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      {grouped.map(([dateLabel, notifications]) => (
        <div key={dateLabel}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">{dateLabel}</h3>
          <div className="space-y-1">
            <AnimatePresence>
              {notifications.map((n, i) => {
                const config = typeConfig[n.type] || { icon: Bell, color: 'text-gray-400', bg: 'bg-navy-700' };
                const Icon = config.icon;
                const senderName = n.sender
                  ? `${n.sender.firstName} ${n.sender.lastName}`
                  : 'Someone';

                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    ref={i === notifications.length - 1 ? lastRef : null}
                    onClick={() => handleClick(n)}
                    className={`glass-card p-4 flex items-start gap-3 cursor-pointer transition-colors hover:bg-navy-800/80 ${
                      !n.read ? 'border-l-2 border-l-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar
                        src={n.sender?.profilePicture}
                        name={senderName}
                        size="md"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center`}>
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">
                        {getMessage(n.type, senderName)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {isLoading && <SkeletonCard />}

      {!isLoading && items.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">No notifications</h3>
          <p className="text-gray-400 text-sm">When someone interacts with you, you'll see it here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;
