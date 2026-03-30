import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Briefcase } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { t } = useTranslation();
  const { login, isLoading, error, resetError } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-navy-900" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">JussConnecc</span>
          </Link>

          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {t('auth.login_title')}
          </h1>
          <p className="text-gray-400 mb-8">{t('auth.login_subtitle')}</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('auth.email')}
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
              onChange={(e) => {
                register('email').onChange(e);
                if (error) resetError();
              }}
            />

            <Input
              label={t('auth.password')}
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-primary 
                             focus:ring-primary/50"
                />
                <span className="text-sm text-gray-400">{t('auth.remember_me')}</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-400">
                {t('auth.forgot_password')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {t('auth.sign_in')}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            {t('auth.no_account')}{' '}
            <Link to="/signup" className="text-primary hover:text-primary-400 font-medium">
              {t('auth.sign_up')}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decoration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center p-12">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Your professional network is waiting. Sign in to continue your journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
