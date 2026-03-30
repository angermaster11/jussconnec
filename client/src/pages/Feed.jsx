import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { fetchFeed, setFilter, clearFeed } from '../features/posts/postsSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const filterTabs = [
  { value: 'all', label: 'For You' },
  { value: 'following', label: 'Following' },
  { value: 'connections', label: 'Connections' },
];

const Feed = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { feed, isLoading, pagination, filter } = useSelector((state) => state.posts);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination.hasMore) {
      dispatch(fetchFeed({ cursor: pagination.cursor, filter }));
    }
  }, [dispatch, isLoading, pagination.hasMore, pagination.cursor, filter]);

  const lastPostRef = useInfiniteScroll(loadMore, isLoading);

  useEffect(() => {
    dispatch(clearFeed());
    dispatch(fetchFeed({ filter }));
  }, [dispatch, filter]);

  const handleFilterChange = (value) => {
    dispatch(setFilter(value));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Filter tabs */}
      <div className="glass-card p-1 flex rounded-xl">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              filter === tab.value
                ? 'bg-primary/10 text-primary'
                : 'text-gray-400 hover:text-gray-300 hover:bg-navy-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Feed */}
      <div className="space-y-4">
        {feed.map((post, index) => (
          <div key={post._id} ref={index === feed.length - 1 ? lastPostRef : null}>
            <PostCard post={post} />
          </div>
        ))}

        {/* Loading skeletons */}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Empty state */}
        {!isLoading && feed.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 text-sm">
              Start following people or create your first post to see content here.
            </p>
          </motion.div>
        )}

        {/* End of feed */}
        {!isLoading && !pagination.hasMore && feed.length > 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            You're all caught up! ✨
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
