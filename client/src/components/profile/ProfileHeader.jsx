import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Users, UserPlus, Pencil, Camera, Globe } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatNumber, formatDate } from '../../utils/helpers';

const ProfileHeader = ({ profileUser, isOwner, onEditClick }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="glass-card overflow-hidden">
      {/* Banner */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary/30 via-navy-800 to-accent/30">
        {profileUser.bannerImage && (
          <img src={profileUser.bannerImage} alt="Banner" className="w-full h-full object-cover" />
        )}
        {isOwner && (
          <button className="absolute top-4 right-4 p-2 bg-black/40 rounded-lg hover:bg-black/60 transition-colors">
            <Camera className="h-5 w-5 text-white" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar - overlaps banner */}
        <div className="relative -mt-16 mb-4 flex items-end justify-between">
          <div className="relative">
            <Avatar
              src={profileUser.profilePicture}
              name={`${profileUser.firstName} ${profileUser.lastName}`}
              size="2xl"
              className="ring-4 ring-navy-900"
            />
            {isOwner && (
              <button className="absolute bottom-1 right-1 p-1.5 bg-navy-700 rounded-full hover:bg-navy-600 border-2 border-navy-900 transition-colors">
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            )}
          </div>
          <div className="flex gap-2 mb-2">
            {isOwner ? (
              <Button variant="outline" size="sm" onClick={onEditClick}>
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="gradient" size="sm">
                  <UserPlus className="h-4 w-4" /> Connect
                </Button>
                <Button variant="secondary" size="sm">
                  Follow
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name & Headline */}
        <h1 className="text-2xl font-heading font-bold text-white">
          {profileUser.firstName} {profileUser.lastName}
          {profileUser.pronouns && (
            <span className="text-sm font-normal text-gray-500 ml-2">({profileUser.pronouns})</span>
          )}
        </h1>
        {profileUser.headline && (
          <p className="text-gray-300 mt-1">{profileUser.headline}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-400">
          {profileUser.location && (
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profileUser.location}</span>
          )}
          {profileUser.experience?.[0]?.company && (
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{profileUser.experience[0].company}</span>
          )}
          {profileUser.website && (
            <a href={profileUser.website} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline">
              <Globe className="h-4 w-4" />{profileUser.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />Joined {formatDate(profileUser.createdAt)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy-700/50">
          <Link to="#" className="hover:text-primary transition-colors">
            <span className="text-white font-semibold">{formatNumber(profileUser.followers?.length || 0)}</span>
            <span className="text-gray-400 text-sm ml-1">Followers</span>
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            <span className="text-white font-semibold">{formatNumber(profileUser.following?.length || 0)}</span>
            <span className="text-gray-400 text-sm ml-1">Following</span>
          </Link>
        </div>

        {/* Open to work badge */}
        {profileUser.openToWork && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl"
          >
            <span className="text-green-400 text-sm font-medium">🟢 Open to work</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
