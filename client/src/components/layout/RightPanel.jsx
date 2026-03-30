import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UserPlus, TrendingUp, ChevronRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { fetchSuggestions } from '../../features/users/usersSlice';

const RightPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { suggestions } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  const trendingTopics = [
    { tag: '#AI', posts: '12.5K' },
    { tag: '#WebDev', posts: '8.2K' },
    { tag: '#Careers', posts: '6.7K' },
    { tag: '#React', posts: '5.1K' },
    { tag: '#StartupLife', posts: '4.3K' },
  ];

  return (
    <div className="space-y-4">
      {/* People You May Know */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-sm">
            {t('common.people_you_may_know')}
          </h3>
          <Link to="/network" className="text-xs text-primary hover:text-primary-400">
            {t('common.see_all')}
          </Link>
        </div>

        <div className="space-y-3">
          {suggestions.slice(0, 5).map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3"
            >
              <Link to={`/profile/${user.username}`}>
                <Avatar
                  src={user.profilePicture}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="sm"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${user.username}`}
                  className="text-sm font-medium text-white hover:text-primary truncate block"
                >
                  {user.firstName} {user.lastName}
                </Link>
                <p className="text-xs text-gray-500 truncate">{user.headline}</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                <UserPlus className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-white text-sm">Trending</h3>
        </div>

        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.tag}
              to={`/search?q=${encodeURIComponent(topic.tag)}`}
              className="flex items-center justify-between px-3 py-2 rounded-lg 
                         hover:bg-white/5 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white group-hover:text-primary">
                  {topic.tag}
                </p>
                <p className="text-xs text-gray-500">{topic.posts} posts</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {['About', 'Help', 'Privacy', 'Terms', 'Advertising'].map((link) => (
            <a key={link} href="#" className="text-xs text-gray-600 hover:text-gray-400">
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-700">
          JussConnecc © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default RightPanel;
