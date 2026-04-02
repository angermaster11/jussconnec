import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Home } from 'lucide-react';
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
    <div style={{ minHeight: '100vh', background: '#090b13', display: 'flex', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Blurred video background */}
      <video autoPlay loop muted playsInline style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px) brightness(0.3) saturate(1.4)', transform: 'scale(1.05)', zIndex: 0, pointerEvents: 'none' }} src="/Signin1.mp4" />
      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', top: '-100px', left: '-150px', background: 'radial-gradient(circle, rgba(197,169,122,0.18) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', bottom: '-80px', left: '20%', background: 'radial-gradient(circle, rgba(100,120,200,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '30%', left: '30%', background: 'radial-gradient(circle, rgba(197,169,122,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .login-left { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative; z-index: 1; }
        .login-card {
          width: 100%; max-width: 520px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .login-logo-glow {
          position: absolute;
          width: 120px; height: 60px;
          background: radial-gradient(ellipse, rgba(197,169,122,0.5) 0%, transparent 70%);
          filter: blur(16px);
          animation: logoGlow 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes logoGlow {
          0%,100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.15) rotate(4deg); opacity: 1; }
        }
        .login-logo-img { height: 80px; width: auto; object-fit: contain; position: relative; z-index: 1; }
        .login-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #ffffff; margin: 0 0 8px; line-height: 1.1; }
        .login-subtitle { font-size: 14px; color: rgba(255,255,255,0.75); margin: 0 0 32px; }
        .login-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; font-size: 13px; color: #f87171; }
        .login-field { margin-bottom: 18px; }
        .login-label { display: block; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; color: #ffffff; margin-bottom: 8px; text-transform: uppercase; }
        .login-input-wrap { position: relative; }
        .login-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(197,169,122,0.5); pointer-events: none; }
        .login-input {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(197,169,122,0.25);
          border-radius: 12px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .login-input::placeholder { color: rgba(255,255,255,0.3); }
        .login-input:focus { border-color: rgba(197,169,122,0.6); background: rgba(255,255,255,0.09); box-shadow: 0 0 0 3px rgba(197,169,122,0.12), inset 0 1px 0 rgba(255,255,255,0.08); }
        .login-input-error { border-color: rgba(239,68,68,0.4) !important; }
        .login-field-error { font-size: 12px; color: #f87171; margin-top: 6px; }
        .login-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .login-remember { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .login-checkbox { width: 16px; height: 16px; accent-color: #c5a97a; cursor: pointer; }
        .login-remember-text { font-size: 14px; color: #ffffff; }
        .login-forgot { font-size: 14px; color: #c5a97a; text-decoration: none; transition: color 0.2s; }
        .login-forgot:hover { color: #e8d5a3; }
        .login-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #c5a97a 0%, #e8d5a3 50%, #c5a97a 100%);
          background-size: 200% 100%;
          background-position: 100% 0;
          color: #0a0c14;
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
          position: relative; overflow: hidden;
        }
        .login-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%); border-radius: 12px; pointer-events: none; }
        .login-btn:hover:not(:disabled) { background-position: 0% 0; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(197,169,122,0.4); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .login-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .login-divider-text { font-size: 12px; color: rgba(240,237,232,0.3); }
        .login-signup { text-align: center; font-size: 15px; color: #ffffff; margin-top: 24px; }
        .login-signup a { color: #c5a97a; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .login-signup a:hover { color: #e8d5a3; }
        .login-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px; position: relative; z-index: 1; }
        .video-frame-wrap { position: relative; width: 720px; height: 460px; }
        .video-frame-inner {
          width: 100%; height: 100%;
          border-radius: 36px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 40px rgba(200,210,230,0.3), 0 0 80px rgba(200,210,230,0.15), inset 0 0 0 2px rgba(210,215,225,0.4);
        }
        .video-frame-inner video { width: 100%; height: 100%; object-fit: contain; background: #000; display: block; }
        .edge-glow-tl { position: absolute; top: -30px; left: -30px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(220,220,230,0.7) 0%, transparent 70%); filter: blur(25px); pointer-events: none; animation: edgePulse 4s ease-in-out infinite; }
        .edge-glow-br { position: absolute; bottom: -30px; right: -30px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(200,210,225,0.65) 0%, transparent 70%); filter: blur(25px); pointer-events: none; animation: edgePulse 4s ease-in-out infinite 2s; }
        .edge-glow-tr { position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(220,220,230,0.55) 0%, transparent 70%); filter: blur(20px); pointer-events: none; animation: edgePulse 5s ease-in-out infinite 1s; }
        .edge-glow-bl { position: absolute; bottom: -20px; left: -20px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(200,210,225,0.55) 0%, transparent 70%); filter: blur(20px); pointer-events: none; animation: edgePulse 5s ease-in-out infinite 3s; }
        .video-border-ring { position: absolute; inset: -6px; border-radius: 42px; border: 1.5px solid rgba(210,215,225,0.5); box-shadow: 0 0 18px rgba(200,210,230,0.35), inset 0 0 18px rgba(200,210,230,0.15); pointer-events: none; animation: ringRotate 12s linear infinite; }
        .video-border-ring2 { position: absolute; inset: -14px; border-radius: 50px; border: 1px solid rgba(200,210,225,0.25); box-shadow: 0 0 30px rgba(200,210,230,0.2); pointer-events: none; animation: ringRotate 18s linear infinite reverse; }
        @keyframes edgePulse { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes ringRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .home-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: rgba(197,169,122,0.1);
          border: 1px solid rgba(197,169,122,0.3);
          border-radius: 50px;
          color: #c5a97a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          transition: all 0.25s ease;
          position: absolute; top: 24px; right: 24px; z-index: 10;
          backdrop-filter: blur(8px);
        }
        .home-btn:hover { background: rgba(197,169,122,0.2); border-color: rgba(197,169,122,0.6); color: #e8d5a3; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(197,169,122,0.2); }
      `}</style>

      {/* Go to Home button */}
      <Link to="/" className="home-btn" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(197,169,122,0.1)', border: '1px solid rgba(197,169,122,0.3)', borderRadius: '50px', color: '#c5a97a', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.25s ease' }}>
        <Home size={15} /> Go to Home
      </Link>

      {/* Left Panel - Sign In Form */}
      <div className="login-left">
        <div className="login-card">
          {/* Logo */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
            <div className="login-logo-glow" />
            <img src="/logo.png" alt="JUssconnec" className="login-logo-img" />
          </Link>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle" style={{ fontSize: '15px', color: '#ffffff', marginBottom: '32px' }}>Sign in to continue your professional journey</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="login-error">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`login-input${errors.email ? ' login-input-error' : ''}`}
                  {...register('email')}
                  onChange={(e) => { register('email').onChange(e); if (error) resetError(); }}
                />
              </div>
              {errors.email && <div className="login-field-error">{errors.email.message}</div>}
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`login-input${errors.password ? ' login-input-error' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && <div className="login-field-error">{errors.password.message}</div>}
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" className="login-checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="login-remember-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="login-signup">
            Don't have an account?{' '}
            <Link to="/signup">Create one free</Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Video */}
      <div className="login-right">
        <div className="video-frame-wrap">
          <div className="edge-glow-tl" />
          <div className="edge-glow-br" />
          <div className="edge-glow-tr" />
          <div className="edge-glow-bl" />
          <div className="video-border-ring2" />
          <div className="video-border-ring" />
          <div className="video-frame-inner">
            <video autoPlay loop muted playsInline src="/Signin1.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
