import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users, UserCheck, Clock, Sparkles, Check, X } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'connections', label: 'Connections', icon: Users },
  { id: 'following', label: 'Following', icon: UserCheck },
  { id: 'followers', label: 'Followers', icon: UserPlus },
];

const Network = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'suggestions':
          res = await api.get('/api/connections/suggestions?limit=20');
          setData(res.data.data?.suggestions || []);
          break;
        case 'pending':
          res = await api.get('/api/connections/pending');
          setData(res.data.data?.requests || []);
          break;
        case 'connections':
        case 'following':
        case 'followers':
          res = await api.get(`/api/users/${user?.username}`);
          const profile = res.data.data?.user;
          if (activeTab === 'following') {
            setData(profile?.following || []);
          } else if (activeTab === 'followers') {
            setData(profile?.followers || []);
          } else {
            // connections = mutual (in both following and followers)
            const followingIds = new Set((profile?.following || []).map((u) => u._id || u));
            const connections = (profile?.followers || []).filter((u) => followingIds.has(u._id || u));
            setData(connections);
          }
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await api.post(`/api/connections/accept/${id}`);
      setData((prev) => prev.filter((r) => r._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDecline = async (id) => {
    try {
      await api.post(`/api/connections/decline/${id}`);
      setData((prev) => prev.filter((r) => r._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleConnect = async (userId) => {
    try {
      await api.post(`/api/connections/request/${userId}`);
      setData((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) { console.error(err); }
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/api/follow/${userId}`);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="glass-card p-2">
        <h1 className="text-xl font-heading font-bold text-white px-4 pt-3 pb-2">My Network</h1>
        <div className="flex gap-1 overflow-x-auto pb-1 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
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
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : data.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">
            {activeTab === 'suggestions' ? 'No suggestions right now' : `No ${activeTab} yet`}
          </h3>
          <p className="text-gray-400 text-sm">
            {activeTab === 'suggestions'
              ? 'Complete your profile to get better suggestions.'
              : 'Start connecting with people to grow your network.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {data.map((item, i) => {
              const person = activeTab === 'pending' ? item.requester : item;
              if (!person || typeof person === 'string') return null;

              return (
                <motion.div
                  key={person._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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
                  </div>

                  {activeTab === 'suggestions' && (
                    <Button variant="outline" size="sm" onClick={() => handleConnect(person._id)}>
                      <UserPlus className="h-4 w-4" /> Connect
                    </Button>
                  )}
                  {activeTab === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(item._id)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                        <Check className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDecline(item._id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  {(activeTab === 'followers' || activeTab === 'connections') && (
                    <Button variant="ghost" size="sm" onClick={() => handleFollow(person._id)}>
                      Follow
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Network;
