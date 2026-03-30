import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Users,
  Briefcase,
  Calendar,
  Hash,
} from 'lucide-react';
import Avatar from '../common/Avatar';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div
          className="h-20 bg-gradient-primary"
          style={
            user.bannerImage
              ? { backgroundImage: `url(${user.bannerImage})`, backgroundSize: 'cover' }
              : {}
          }
        />

        <div className="px-4 pb-4">
          <Link to={`/profile/${user.username}`} className="-mt-8 block relative">
            <Avatar
              src={user.profilePicture}
              firstName={user.firstName}
              lastName={user.lastName}
              size="xl"
              className="ring-4 ring-surface"
            />
          </Link>

          <Link to={`/profile/${user.username}`} className="mt-2 block">
            <h3 className="font-semibold text-white hover:text-primary transition-colors">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{user.headline || 'Add a headline'}</p>
          </Link>

          {/* Stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{user.connectionsCount || 0}</p>
              <p className="text-xs text-gray-500">{t('profile.connections')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{user.followersCount || 0}</p>
              <p className="text-xs text-gray-500">{t('profile.followers')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="glass-card p-2">
        <Link
          to="/feed"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 
                     hover:text-white transition-all"
        >
          <Bookmark className="h-4 w-4" />
          <span className="text-sm">{t('feed.saved') || 'Saved Posts'}</span>
        </Link>
        <Link
          to="/network"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 
                     hover:text-white transition-all"
        >
          <Users className="h-4 w-4" />
          <span className="text-sm">{t('nav.network')}</span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 
                     hover:text-white transition-all"
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Events</span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 
                     hover:text-white transition-all"
        >
          <Hash className="h-4 w-4" />
          <span className="text-sm">Hashtags</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
