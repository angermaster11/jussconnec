import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users, FileText, Hash, SlidersHorizontal } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import PostCard from '../components/feed/PostCard';
import Button from '../components/common/Button';
import { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';

const tabs = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'hashtags', label: 'Hashtags', icon: Hash },
];

const Search = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('people');
  const [results, setResults] = useState({ people: [], posts: [], hashtags: [] });
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      if (activeTab === 'people') {
        const res = await api.get(`/api/users/search?q=${encodeURIComponent(q)}`);
        setResults((prev) => ({ ...prev, people: res.data.data?.users || [] }));
      } else if (activeTab === 'posts') {
        const res = await api.get(`/api/posts?search=${encodeURIComponent(q)}`);
        setResults((prev) => ({ ...prev, posts: res.data.data?.posts || [] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams, activeTab, doSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      doSearch(query);
    }
  };

  const currentResults = results[activeTab] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="glass-card p-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, posts, hashtags..."
            className="w-full pl-12 pr-4 py-3.5 bg-navy-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            autoFocus
          />
        </div>
      </form>

      {/* Tabs */}
      <div className="glass-card p-1 flex rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-navy-700/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
      ) : !searchParams.get('q') ? (
        <div className="glass-card p-12 text-center">
          <SearchIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-white mb-2">Search JussConnecc</h3>
          <p className="text-gray-400 text-sm">Find people, posts, and topics that interest you</p>
        </div>
      ) : currentResults.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <h3 className="text-lg font-heading font-semibold text-white mb-2">No results</h3>
          <p className="text-gray-400 text-sm">Try different keywords or check the spelling</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'people' &&
            currentResults.map((person, i) => (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <Link to={`/profile/${person.username}`}>
                  <Avatar src={person.profilePicture} name={`${person.firstName} ${person.lastName}`} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${person.username}`} className="text-white font-medium text-sm hover:text-primary transition-colors">
                    {person.firstName} {person.lastName}
                  </Link>
                  <p className="text-gray-500 text-xs truncate">{person.headline || ''}</p>
                  {person.location && <p className="text-gray-500 text-xs">{person.location}</p>}
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </motion.div>
            ))}

          {activeTab === 'posts' &&
            currentResults.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

          {activeTab === 'hashtags' && (
            <div className="glass-card p-6">
              <p className="text-gray-400 text-sm text-center">Hashtag search coming soon</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
