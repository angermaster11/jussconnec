import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, GraduationCap, MapPin, Link2, Code, Camera,
  ChevronRight, ChevronLeft, Check, Upload,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { updateProfile } from '../features/users/usersSlice';
import api from '../services/api';

const steps = [
  { id: 'photo', icon: Camera, label: 'Profile Photo' },
  { id: 'headline', icon: Briefcase, label: 'Headline' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'education', icon: GraduationCap, label: 'Education' },
  { id: 'skills', icon: Code, label: 'Skills' },
  { id: 'links', icon: Link2, label: 'Links & Location' },
];

const CompleteProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    profilePicture: null,
    previewUrl: user?.profilePicture || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    company: '',
    title: '',
    expLocation: '',
    school: '',
    degree: '',
    fieldOfStudy: '',
    skills: [],
    skillInput: '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update('profilePicture', file);
    update('previewUrl', URL.createObjectURL(file));
  };

  const addSkill = () => {
    const s = formData.skillInput.trim();
    if (s && !formData.skills.includes(s) && formData.skills.length < 20) {
      update('skills', [...formData.skills, s]);
      update('skillInput', '');
    }
  };

  const removeSkill = (skill) => {
    update('skills', formData.skills.filter((s) => s !== skill));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Upload photo if selected
      if (formData.profilePicture) {
        const fd = new FormData();
        fd.append('profilePicture', formData.profilePicture);
        await api.put('/api/users/me/picture', fd);
      }

      // Update profile fields
      const profilePayload = {};
      if (formData.headline) profilePayload.headline = formData.headline;
      if (formData.bio) profilePayload.bio = formData.bio;
      if (formData.location) profilePayload.location = formData.location;
      if (formData.website) profilePayload.website = formData.website;

      if (Object.keys(profilePayload).length) {
        await dispatch(updateProfile(profilePayload)).unwrap();
      }

      // Update skills
      if (formData.skills.length > 0) {
        await api.put('/api/users/me/skills', { skills: formData.skills });
      }

      // Add experience if filled
      if (formData.company && formData.title) {
        await api.put('/api/users/me/experience', {
          experience: [
            { company: formData.company, title: formData.title, location: formData.expLocation, current: true },
          ],
        });
      }

      // Add education if filled
      if (formData.school) {
        await api.put('/api/users/me/education', {
          education: [
            { school: formData.school, degree: formData.degree, fieldOfStudy: formData.fieldOfStudy },
          ],
        });
      }

      navigate('/feed');
    } catch (err) {
      console.error('Profile completion error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canNext = currentStep < steps.length - 1;
  const canPrev = currentStep > 0;

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'photo':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-navy-700 overflow-hidden border-4 border-navy-600 group-hover:border-primary transition-colors">
                {formData.previewUrl ? (
                  <img src={formData.previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            <p className="text-gray-400 text-sm text-center">Upload a professional photo to make a great first impression</p>
          </div>
        );

      case 'headline':
        return (
          <div className="space-y-4">
            <Input
              label="Professional Headline"
              placeholder="e.g. Full Stack Developer | React & Node.js"
              value={formData.headline}
              onChange={(e) => update('headline', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                className="input-field w-full min-h-[120px] resize-none"
                placeholder="Tell people about yourself..."
                value={formData.bio}
                onChange={(e) => update('bio', e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right mt-1">{formData.bio.length}/500</p>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-2">Add your most recent position</p>
            <Input
              label="Job Title"
              icon={Briefcase}
              placeholder="Software Engineer"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
            />
            <Input
              label="Company"
              placeholder="Acme Inc."
              value={formData.company}
              onChange={(e) => update('company', e.target.value)}
            />
            <Input
              label="Location"
              icon={MapPin}
              placeholder="San Francisco, CA"
              value={formData.expLocation}
              onChange={(e) => update('expLocation', e.target.value)}
            />
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-2">Add your highest education</p>
            <Input
              label="School"
              icon={GraduationCap}
              placeholder="MIT"
              value={formData.school}
              onChange={(e) => update('school', e.target.value)}
            />
            <Input
              label="Degree"
              placeholder="Bachelor's"
              value={formData.degree}
              onChange={(e) => update('degree', e.target.value)}
            />
            <Input
              label="Field of Study"
              placeholder="Computer Science"
              value={formData.fieldOfStudy}
              onChange={(e) => update('fieldOfStudy', e.target.value)}
            />
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                label="Add Skills"
                icon={Code}
                placeholder="e.g. React, Node.js"
                value={formData.skillInput}
                onChange={(e) => update('skillInput', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button variant="secondary" className="mt-7" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} ×
                </span>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p className="text-sm text-gray-500">Press Enter or click Add to add skills</p>
            )}
          </div>
        );

      case 'links':
        return (
          <div className="space-y-4">
            <Input
              label="Location"
              icon={MapPin}
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
            />
            <Input
              label="Website"
              icon={Link2}
              placeholder="https://yoursite.com"
              value={formData.website}
              onChange={(e) => update('website', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-400">A complete profile gets 40x more opportunities</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const active = idx === currentStep;
            const done = idx < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? 'bg-primary text-navy-900'
                      : active
                        ? 'bg-primary/20 text-primary ring-2 ring-primary'
                        : 'bg-navy-700 text-gray-500'
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </button>
                <span className={`text-xs hidden sm:block ${active ? 'text-primary' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
            {(() => { const Icon = steps[currentStep].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
            {steps[currentStep].label}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-navy-700">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={!canPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => navigate('/feed')}>
                Skip for now
              </Button>
              {canNext ? (
                <Button variant="primary" onClick={() => setCurrentStep((s) => s + 1)}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="gradient" onClick={handleFinish} isLoading={isSubmitting}>
                  Finish Setup
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 bg-navy-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Step {currentStep + 1} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
