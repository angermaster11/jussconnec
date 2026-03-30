import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  User, Shield, Bell, Eye, Palette, Globe, Lock, Moon, Sun, Monitor, ChevronRight, LogOut, Trash2,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { updateProfile } from '../features/users/usersSlice';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const settingsSections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
];

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');

  // Form states
  const [accountForm, setAccountForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.settings?.privacy?.profileVisibility || 'public',
    showEmail: user?.settings?.privacy?.showEmail ?? false,
    showPhone: user?.settings?.privacy?.showPhone ?? false,
  });

  const [notifSettings, setNotifSettings] = useState({
    email: user?.settings?.notifications?.email ?? true,
    push: user?.settings?.notifications?.push ?? true,
    connections: user?.settings?.notifications?.connections ?? true,
    messages: user?.settings?.notifications?.messages ?? true,
    posts: user?.settings?.notifications?.posts ?? true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [theme, setTheme] = useState(user?.settings?.appearance?.theme || 'dark');
  const [language, setLanguage] = useState(user?.settings?.language || 'en');

  const handleAccountSave = async () => {
    try {
      await dispatch(updateProfile({
        firstName: accountForm.firstName,
        lastName: accountForm.lastName,
      })).unwrap();
      toast.success('Account updated');
    } catch { toast.error('Failed to update account'); }
  };

  const handlePrivacySave = async () => {
    try {
      await dispatch(updateProfile({
        settings: { ...user?.settings, privacy: privacySettings },
      })).unwrap();
      toast.success('Privacy settings updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleNotifSave = async () => {
    try {
      await dispatch(updateProfile({
        settings: { ...user?.settings, notifications: notifSettings },
      })).unwrap();
      toast.success('Notification settings updated');
    } catch { toast.error('Failed to update'); }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lng) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={accountForm.firstName}
                    onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })} />
                  <Input label="Last Name" value={accountForm.lastName}
                    onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })} />
                </div>
                <Input label="Username" value={accountForm.username} disabled
                  onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })} />
                <Input label="Email" type="email" value={accountForm.email} disabled
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} />
                <Button variant="gradient" onClick={handleAccountSave}>Save Changes</Button>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-6">
              <h3 className="text-lg font-heading font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Log Out
                </Button>
                <Button variant="danger">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
                <select value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                  className="input-field w-full">
                  <option value="public">Public - Visible to everyone</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private - Only you</option>
                </select>
              </div>
              <ToggleSetting label="Show Email" description="Allow others to see your email"
                value={privacySettings.showEmail}
                onChange={(v) => setPrivacySettings({ ...privacySettings, showEmail: v })} />
              <ToggleSetting label="Show Phone" description="Allow others to see your phone number"
                value={privacySettings.showPhone}
                onChange={(v) => setPrivacySettings({ ...privacySettings, showPhone: v })} />
              <Button variant="gradient" onClick={handlePrivacySave}>Save Privacy Settings</Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <ToggleSetting label="Email Notifications" description="Receive notifications via email"
                value={notifSettings.email}
                onChange={(v) => setNotifSettings({ ...notifSettings, email: v })} />
              <ToggleSetting label="Push Notifications" description="Receive browser push notifications"
                value={notifSettings.push}
                onChange={(v) => setNotifSettings({ ...notifSettings, push: v })} />
              <ToggleSetting label="Connection Requests" description="When someone sends you a request"
                value={notifSettings.connections}
                onChange={(v) => setNotifSettings({ ...notifSettings, connections: v })} />
              <ToggleSetting label="Messages" description="When you receive a new message"
                value={notifSettings.messages}
                onChange={(v) => setNotifSettings({ ...notifSettings, messages: v })} />
              <ToggleSetting label="Post Activity" description="Likes, comments, and reposts on your posts"
                value={notifSettings.posts}
                onChange={(v) => setNotifSettings({ ...notifSettings, posts: v })} />
              <Button variant="gradient" onClick={handleNotifSave}>Save Notification Settings</Button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <Input type="password" label="Current Password" value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
              <Input type="password" label="New Password" value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
              <Input type="password" label="Confirm New Password" value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
              <Button variant="gradient" onClick={handlePasswordChange}
                disabled={!passwordForm.currentPassword || !passwordForm.newPassword}>
                Change Password
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Appearance</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'system', icon: Monitor, label: 'System' },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleThemeChange(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      theme === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-navy-700 bg-navy-800 text-gray-400 hover:border-navy-600'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Language</h3>
            <div className="space-y-2">
              {[
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
                { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
                { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
              ].map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => handleLanguageChange(lng.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    language === lng.code
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-navy-800 text-gray-300 border border-navy-700 hover:border-navy-600'
                  }`}
                >
                  <span className="text-2xl">{lng.flag}</span>
                  <span className="font-medium">{lng.label}</span>
                  {language === lng.code && (
                    <span className="ml-auto text-xs bg-primary text-navy-900 px-2 py-0.5 rounded-full font-semibold">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Settings</h1>
      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-56 flex-shrink-0 hidden md:block space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-navy-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {section.label}
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            );
          })}
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden w-full">
          <div className="flex gap-1 overflow-x-auto mb-4 pb-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 bg-navy-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 glass-card p-6"
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
};

// Toggle Setting component
const ToggleSetting = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-navy-700/50">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-navy-600'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  </div>
);

export default Settings;
