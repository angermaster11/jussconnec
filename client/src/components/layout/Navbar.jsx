import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { path: '/feed', icon: Home, label: t('nav.home') },
    { path: '/network', icon: Users, label: t('nav.network') },
    { path: '/messages', icon: MessageSquare, label: t('nav.messages') },
    { path: '/notifications', icon: Bell, label: t('nav.notifications'), badge: unreadCount },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Search */}
          <div className="flex items-center gap-4">
            <Link to="/feed" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-navy-900" />
              </div>
              <span className="hidden sm:block font-heading font-bold text-lg gradient-text">
                JussConnecc
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-64 bg-navy-800 border border-navy-700 rounded-xl pl-10 pr-4 py-2 
                           text-sm text-white placeholder-gray-500 focus:outline-none 
                           focus:border-primary/50 transition-all"
              />
            </form>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex flex-col items-center px-4 py-2 rounded-xl transition-all',
                    isActive
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 
                                       bg-red-500 rounded-full text-[10px] font-bold 
                                       text-white flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile Menu */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                <Avatar
                  src={user?.profilePicture}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="sm"
                />
                <span className="hidden lg:block text-sm text-gray-300">
                  {user?.firstName}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 glass-card p-2 shadow-2xl"
                  >
                    <div className="p-3 border-b border-white/5">
                      <p className="font-semibold text-white">{user?.fullName}</p>
                      <p className="text-sm text-gray-400 truncate">{user?.headline}</p>
                    </div>
                    <Link
                      to={`/profile/${user?.username}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                 hover:bg-white/5 text-gray-300 transition-colors mt-1"
                    >
                      <Avatar src={user?.profilePicture} firstName={user?.firstName} lastName={user?.lastName} size="xs" />
                      <span className="text-sm">{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                 hover:bg-white/5 text-gray-300 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">{t('nav.settings')}</span>
                    </Link>
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                 hover:bg-red-500/10 text-gray-300 hover:text-red-400 
                                 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">{t('nav.logout')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 text-gray-400"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-navy-900/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="w-full bg-navy-800 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 
                             text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                />
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
