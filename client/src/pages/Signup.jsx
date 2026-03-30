import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, MapPin, Briefcase, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens, underscores'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const step2Schema = z.object({
  headline: z.string().optional(),
  location: z.string().optional(),
});

const Signup = () => {
  const { t } = useTranslation();
  const { register: registerUser, isLoading, error, resetError } = useAuth();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const step1Form = useForm({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm({ resolver: zodResolver(step2Schema) });

  // Password strength
  const password = step1Form.watch('password') || '';
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
  const strength = getPasswordStrength();

  const handleStep1 = (data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2 = async (data) => {
    if (!agreeTerms) return;
    const { confirmPassword, ...rest } = step1Data;
    await registerUser({ ...rest, ...data });
  };

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Left - Decoration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center p-12">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Start Your Journey
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Join a community of professionals who are building the future together.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-navy-900" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">JussConnecc</span>
          </Link>

          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {t('auth.signup_title')}
          </h1>
          <p className="text-gray-400 mb-2">{t('auth.signup_subtitle')}</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step >= 1 ? 'bg-primary text-navy-900' : 'bg-navy-700 text-gray-400'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm text-gray-400">{t('auth.step_1')}</span>
            </div>
            <div className="flex-1 h-px bg-navy-700" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step >= 2 ? 'bg-primary text-navy-900' : 'bg-navy-700 text-gray-400'}`}>
                2
              </div>
              <span className="text-sm text-gray-400">{t('auth.step_2')}</span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={step1Form.handleSubmit(handleStep1)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('auth.first_name')}
                  icon={User}
                  placeholder="John"
                  error={step1Form.formState.errors.firstName?.message}
                  {...step1Form.register('firstName')}
                />
                <Input
                  label={t('auth.last_name')}
                  placeholder="Doe"
                  error={step1Form.formState.errors.lastName?.message}
                  {...step1Form.register('lastName')}
                />
              </div>

              <Input
                label={t('auth.username')}
                icon={User}
                placeholder="johndoe"
                error={step1Form.formState.errors.username?.message}
                {...step1Form.register('username')}
              />

              <Input
                label={t('auth.email')}
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                error={step1Form.formState.errors.email?.message}
                {...step1Form.register('email')}
              />

              <div>
                <Input
                  label={t('auth.password')}
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  error={step1Form.formState.errors.password?.message}
                  {...step1Form.register('password')}
                />
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= strength ? strengthColors[strength] : 'bg-navy-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              <Input
                label={t('auth.confirm_password')}
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={step1Form.formState.errors.confirmPassword?.message}
                {...step1Form.register('confirmPassword')}
              />

              <Button type="submit" variant="gradient" size="lg" className="w-full">
                {t('auth.next')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.form>
          )}

          {/* Step 2: Professional Details */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={step2Form.handleSubmit(handleStep2)}
              className="space-y-4"
            >
              <Input
                label={t('auth.profession')}
                icon={Briefcase}
                placeholder="Full Stack Developer"
                {...step2Form.register('headline')}
              />

              <Input
                label={t('auth.location')}
                icon={MapPin}
                placeholder="San Francisco, CA"
                {...step2Form.register('location')}
              />

              <label className="flex items-start gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-800 text-primary"
                />
                <span className="text-sm text-gray-400">{t('auth.terms')}</span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('auth.back')}
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={!agreeTerms}
                >
                  {isLoading ? t('auth.creating') : t('auth.sign_up')}
                </Button>
              </div>
            </motion.form>
          )}

          <p className="text-center text-gray-400 mt-8">
            {t('auth.has_account')}{' '}
            <Link to="/login" className="text-primary hover:text-primary-400 font-medium">
              {t('auth.sign_in')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
