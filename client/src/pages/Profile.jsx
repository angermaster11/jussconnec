import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ProfileHeader from '../components/profile/ProfileHeader';
import AboutSection from '../components/profile/AboutSection';
import ExperienceCard from '../components/profile/ExperienceCard';
import EducationCard from '../components/profile/EducationCard';
import SkillsSection from '../components/profile/SkillsSection';
import ProjectsGrid from '../components/profile/ProjectsGrid';
import { SkeletonProfile } from '../components/common/Skeleton';
import { fetchUserProfile } from '../features/users/usersSlice';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileUser, isLoading } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
    }
  }, [dispatch, username]);

  if (isLoading || !profileUser) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <SkeletonProfile />
      </div>
    );
  }

  if (profileUser.isPrivate) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <ProfileHeader profileUser={profileUser} isOwner={false} />
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">This profile is private</h3>
          <p className="text-gray-400 text-sm">Connect with this person to see their full profile.</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ProfileHeader profileUser={profileUser} isOwner={isOwner} />
      <AboutSection bio={profileUser.bio} isOwner={isOwner} />
      <ExperienceCard experience={profileUser.experience} isOwner={isOwner} />
      <EducationCard education={profileUser.education} isOwner={isOwner} />
      <SkillsSection skills={profileUser.skills} isOwner={isOwner} />
      <ProjectsGrid projects={profileUser.projects} isOwner={isOwner} />
    </div>
  );
};

export default Profile;
