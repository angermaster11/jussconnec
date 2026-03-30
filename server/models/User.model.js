import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String,
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'self-employed'],
  },
});

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: String,
  field: String,
  startYear: Number,
  endYear: Number,
  grade: String,
  activities: String,
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: Date,
  credentialUrl: String,
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  liveUrl: String,
  repoUrl: String,
  techStack: [String],
  thumbnail: String,
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    headline: { type: String, maxlength: 220 },
    bio: { type: String, maxlength: 2600 },
    profilePicture: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    location: String,
    website: String,
    pronouns: String,
    openToWork: { type: Boolean, default: false },

    experience: [experienceSchema],
    education: [educationSchema],
    skills: [{ type: String, trim: true }],
    certifications: [certificationSchema],
    projects: [projectSchema],

    completedProfile: { type: Boolean, default: false },
    profileCompletionPercentage: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    refreshToken: { type: String, select: false },

    settings: {
      language: { type: String, default: 'en' },
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        connectionRequests: { type: Boolean, default: true },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'connections', 'private'],
          default: 'public',
        },
        showEmail: { type: Boolean, default: false },
      },
      appearance: {
        fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
        feedDensity: { type: String, enum: ['compact', 'comfortable'], default: 'comfortable' },
      },
    },

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    connectionsCount: { type: Number, default: 0 },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    recentSearches: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ skills: 1 });
userSchema.index({ location: 1 });
userSchema.index({ firstName: 'text', lastName: 'text', headline: 'text', skills: 'text' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  const total = 10;

  if (this.profilePicture) score++;
  if (this.bannerImage) score++;
  if (this.headline) score++;
  if (this.bio) score++;
  if (this.location) score++;
  if (this.experience?.length > 0) score++;
  if (this.education?.length > 0) score++;
  if (this.skills?.length > 0) score++;
  if (this.projects?.length > 0) score++;
  if (this.certifications?.length > 0) score++;

  this.profileCompletionPercentage = Math.round((score / total) * 100);
  this.completedProfile = score >= 6;

  return this.profileCompletionPercentage;
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
