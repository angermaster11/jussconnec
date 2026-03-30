import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  MessageSquare,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../components/common/Button';
import Footer from '../components/layout/Footer';

const Landing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Users,
      title: t('landing.feature_1_title'),
      description: t('landing.feature_1_desc'),
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Sparkles,
      title: t('landing.feature_2_title'),
      description: t('landing.feature_2_desc'),
      color: 'text-accent-400',
      bg: 'bg-accent/10',
    },
    {
      icon: Briefcase,
      title: t('landing.feature_3_title'),
      description: t('landing.feature_3_desc'),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: MessageSquare,
      title: t('landing.feature_4_title'),
      description: t('landing.feature_4_desc'),
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  const stats = [
    { value: '10K+', label: t('landing.stats_users') },
    { value: '50K+', label: t('landing.stats_posts') },
    { value: '100K+', label: t('landing.stats_connections') },
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-navy-900" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">JussConnecc</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md">
                {t('landing.cta_login')}
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="gradient" size="md">
                {t('landing.cta_signup')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 
                            border border-primary/20 mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">The Future of Professional Networking</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight">
              <span className="text-white">Where Professionals</span>
              <br />
              <span className="gradient-text">JussConnecc</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('landing.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="gradient" size="xl" className="shadow-lg shadow-primary/20">
                  {t('landing.cta_signup')}
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">
                  {t('landing.cta_login')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-12 sm:gap-20 mt-20"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-heading font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              {t('landing.features_title')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need to build meaningful professional relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card-hover p-6 group"
              >
                <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center 
                                 justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <div className="relative">
              <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-bold text-white mb-4">
                Ready to JussConnecc?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of professionals who are already building their network on JussConnecc.
              </p>
              <Link to="/signup">
                <Button variant="gradient" size="xl" className="shadow-lg shadow-primary/20">
                  {t('landing.cta_signup')}
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
