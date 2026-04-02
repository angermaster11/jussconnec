import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const Landing = () => {
  const [isLight, setIsLight] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [connectedCards, setConnectedCards] = useState({});
  const [following, setFollowing] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLight]);

  const toggleConnect = (id) => {
    setConnectedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFollow = (id) => {
    setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <style>{`
        :root {
          --glass-bg: rgba(255,255,255,0.08);
          --glass-border: rgba(255,255,255,0.18);
          --glass-shadow: 0 8px 48px rgba(0,0,0,0.28);
          --blur: blur(22px);
          --accent: #c5a97a;
          --accent2: #7ab8c5;
          --accent3: #a78fc5;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.55);
          --brand: #c5a97a;
          --body-bg: #090b13;
          --nav-bg: rgba(9,11,19,0.55);
          --nav-border: rgba(255,255,255,0.07);
          --footer-border: rgba(255,255,255,0.06);
          --divider-color: rgba(255,255,255,0.07);
          --stat-border: rgba(255,255,255,0.07);
          --suggest-border: rgba(255,255,255,0.05);
          --trend-border: rgba(255,255,255,0.05);
          --footer-copy: rgba(240,237,232,0.3);
          --font-serif: 'Cormorant Garamond', serif;
          --font-sans: 'DM Sans', sans-serif;
        }
        .light {
          --glass-bg: rgba(255,255,255,0.55);
          --glass-border: rgba(180,150,100,0.22);
          --glass-shadow: 0 8px 48px rgba(100,80,40,0.12);
          --accent: #9a7a45;
          --accent2: #3a8a9a;
          --accent3: #6a5a8a;
          --text: #1a1610;
          --text-muted: rgba(26,22,16,0.55);
          --body-bg: #f5f0e8;
          --nav-bg: rgba(245,240,232,0.82);
        }
        .light .search-bar {
          color: #1a1610;
          border-color: rgba(154,122,69,0.3);
          background: rgba(154,122,69,0.07);
        }
        .light .search-bar::placeholder {
          color: rgba(154,122,69,0.55);
        }
        .light .search-bar:focus {
          border-color: rgba(154,122,69,0.6);
          background: rgba(154,122,69,0.1);
        }
        .light .btn-ghost {
          color: #1a1610;
        }
        .light .btn-primary {
          color: #fff;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: var(--font-sans);
          color: var(--text);
          background: var(--body-bg);
        }
        .bg-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--body-bg);
          z-index: -2;
        }
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 88px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--nav-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border-bottom: 1px solid var(--nav-border);
          z-index: 100;
          animation: slideDown 0.8s ease-out;
        }
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }
        .logo {
          font-family: var(--font-serif);
          font-size: 28px;
          letter-spacing: 2px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .logo-glow {
          position: absolute;
          inset: -18px -24px;
          border-radius: 50%;
          background: radial-gradient(ellipse 80% 60% at 50% 50%,
            rgba(197,169,122,0.55) 0%,
            rgba(212,180,100,0.3) 35%,
            rgba(197,169,122,0.08) 65%,
            transparent 100%);
          filter: blur(18px);
          animation: logoLiquid 5s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }
        @keyframes logoLiquid {
          0%   { transform: scale(1)    rotate(0deg)   skewX(0deg);  opacity: 0.85; }
          25%  { transform: scale(1.12) rotate(6deg)   skewX(3deg);  opacity: 1;    }
          50%  { transform: scale(0.95) rotate(-4deg)  skewX(-2deg); opacity: 0.75; }
          75%  { transform: scale(1.08) rotate(3deg)   skewX(2deg);  opacity: 1;    }
          100% { transform: scale(1)    rotate(0deg)   skewX(0deg);  opacity: 0.85; }
        }
        .logo-img {
          height: 64px;
          width: auto;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }
        .nav-links {
          display: flex;
          gap: 32px;
        }
        .nav-link {
          font-size: 15.5px;
          color: var(--text-muted);
          text-decoration: none;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--accent);
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: rgba(197,169,122,0.7);
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .search-bar {
          width: 240px;
          padding: 11px 18px 11px 42px;
          border-radius: 50px;
          border: 1px solid rgba(197,169,122,0.28);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.2);
          letter-spacing: 0.2px;
        }
        .search-bar::placeholder {
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.3px;
        }
        .search-bar:focus {
          width: 300px;
          border-color: rgba(197,169,122,0.65);
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(197,169,122,0.15), inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 12px rgba(0,0,0,0.25);
        }
        .light .search-bar {
          color: #1a1610;
          background: rgba(255,255,255,0.6);
          border-color: rgba(154,122,69,0.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.06);
        }
        .light .search-bar::placeholder {
          color: rgba(154,122,69,0.55);
        }
        .light .search-bar:focus {
          border-color: rgba(154,122,69,0.6);
          background: rgba(255,255,255,0.8);
          color: #1a1610;
        }
        .light .search-icon {
          color: rgba(154,122,69,0.7);
        }
        .notif-wrap {
          position: relative;
        }
        .notif-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          position: relative;
        }
        .notif-btn:hover {
          background: rgba(197,169,122,0.1);
          border-color: rgba(197,169,122,0.3);
          color: var(--accent);
        }
        .notif-box {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 300px;
          background: rgba(12,14,22,0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,169,122,0.08);
          overflow: hidden;
          animation: notifDrop 0.25s cubic-bezier(0.4,0,0.2,1);
          z-index: 200;
        }
        @keyframes notifDrop {
          0% { opacity: 0; transform: translateY(-8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .notif-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: 0.3px;
        }
        .notif-empty {
          padding: 36px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .notif-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(197,169,122,0.08);
          border: 1px solid rgba(197,169,122,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(197,169,122,0.5);
        }
        .notif-empty-text {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }
        .btn-ghost {
          padding: 13px 28px;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--text);
          border-radius: 50px;
          cursor: pointer;
          font-size: 15px;
          font-family: var(--font-sans);
          letter-spacing: 0.2px;
          transition: all 0.3s;
        }
        .btn-ghost:hover {
          background: var(--glass-bg);
          border-color: rgba(255,255,255,0.25);
        }
        .btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg, #c5a97a 0%, #e8d5a3 50%, #c5a97a 100%);
          background-size: 200% 100%;
          background-position: 100% 0;
          color: #0a0c14;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 15px;
          font-family: var(--font-sans);
          font-weight: 600;
          letter-spacing: 0.4px;
          transition: background-position 0.4s ease, transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          border-radius: 50px;
          pointer-events: none;
        }
        .btn-primary:hover {
          background-position: 0% 0;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(197,169,122,0.5), 0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .btn-primary:active {
          transform: translateY(0px);
          box-shadow: 0 2px 8px rgba(197,169,122,0.3);
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .hamburger span {
          width: 24px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s;
        }
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: var(--nav-bg);
          backdrop-filter: var(--blur);
          padding: 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hero {
          min-height: calc(100vh - 68px);
          padding: 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .hero-left {
          animation: fadeUp 0.9s 0.2s both;
        }
        .hero-right {
          animation: fadeUp 0.9s 0.4s both;
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 28px;
          padding: 7px 18px 7px 14px;
          border: 1px solid rgba(197,169,122,0.25);
          border-radius: 50px;
          background: rgba(197,169,122,0.06);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--accent);
          animation: eyebrowPulse 2s ease-in-out infinite;
          position: static;
          transform: none;
        }
        @keyframes eyebrowPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--accent); }
          50% { opacity: 0.5; box-shadow: 0 0 14px var(--accent); }
        }
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(52px, 6vw, 88px);
          font-weight: 300;
          line-height: 1.05;
          margin-bottom: 16px;
        }
        .hero-title .italic {
          font-style: italic;
          color: var(--accent);
        }
        .hero-title .gradient {
          background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-muted);
          max-width: 440px;
          margin-bottom: 32px;
        }
        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
        }
        .stats {
          display: flex;
          gap: 40px;
          border-top: 1px solid var(--divider-color);
          padding-top: 40px;
        }
        .stat-number {
          font-family: var(--font-serif);
          font-size: 36px;
          color: var(--accent);
        }
        .stat-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 8px;
        }
        .hero-right {
          position: relative;
        }
        .profile-card {
          position: absolute;
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          border-radius: 24px;
          padding: 20px;
          transition: all 0.3s;
        }
        .profile-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .card-main {
          top: 0;
          right: 60px;
          width: 260px;
          animation: floatCard 6s infinite;
        }
        .card-2 {
          top: 180px;
          right: 0;
          width: 220px;
          animation: floatCard2 7s infinite;
        }
        .card-3 {
          top: 340px;
          right: 100px;
          width: 230px;
          animation: floatCard3 8s infinite;
        }
        .card-4 {
          top: 100px;
          right: 310px;
          width: 190px;
          animation: floatCard reversed 9s infinite;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .card-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--body-bg);
          margin-bottom: 12px;
        }
        .card-name {
          font-family: var(--font-serif);
          font-size: 18px;
          margin-bottom: 4px;
        }
        .card-role {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .card-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .card-tag {
          padding: 4px 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .connect-btn {
          padding: 8px 16px;
          background: var(--accent);
          color: var(--body-bg);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .connect-btn.connected {
          background: var(--accent);
        }
        .floating-badge {
          position: absolute;
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 12px 16px;
          animation: floatCard2 6s infinite;
        }
        .badge-1 {
          top: 20px;
          left: 0;
        }
        .badge-2 {
          bottom: 40px;
          left: 20px;
        }
        .badge-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .badge-1 .badge-dot {
          background: green;
        }
        .badge-2 .badge-dot {
          background: var(--accent);
        }
        .features {
          padding: 100px 80px;
        }
        .section-label {
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-serif);
          font-size: 48px;
          margin-bottom: 16px;
        }
        .section-title .italic {
          font-style: italic;
          color: var(--accent2);
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .feature-card {
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          border-radius: 24px;
          padding: 36px 32px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .feature-icon.gold {
          background: linear-gradient(135deg, var(--accent), rgba(197,169,122,0.2));
        }
        .feature-icon.teal {
          background: linear-gradient(135deg, var(--accent2), rgba(122,184,197,0.2));
        }
        .feature-icon.purple {
          background: linear-gradient(135deg, var(--accent3), rgba(167,143,197,0.2));
        }
        .feature-title {
          font-family: var(--font-serif);
          font-size: 24px;
          margin-bottom: 12px;
        }
        .feature-desc {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .feed {
          padding: 100px 80px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 60px;
        }
        .feed-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .feed-title {
          font-family: var(--font-serif);
          font-size: 40px;
          margin-bottom: 40px;
        }
        .feed-title .italic {
          font-style: italic;
          color: var(--accent3);
        }
        .post-card {
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          border-radius: 20px;
          padding: 26px;
          transition: all 0.3s;
        }
        .post-card:hover {
          transform: translateX(6px);
        }
        .post-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .post-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--body-bg);
        }
        .post-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .post-meta {
          font-size: 12px;
          color: var(--text-muted);
        }
        .post-body {
          font-size: 13.5px;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .post-actions {
          display: flex;
          gap: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color);
        }
        .post-action {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
          transition: color 0.3s;
        }
        .post-action:hover {
          color: var(--text);
        }
        .post-action.liked {
          color: var(--accent);
        }
        .sidebar {
          position: sticky;
          top: 88px;
        }
        .sidebar-widget {
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .widget-title {
          font-family: var(--font-serif);
          font-size: 18px;
          margin-bottom: 16px;
        }
        .connect-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .connect-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--body-bg);
        }
        .connect-name {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .connect-role {
          font-size: 12px;
          color: var(--text-muted);
        }
        .follow-btn {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          font-weight: 500;
          transition: color 0.3s;
        }
        .follow-btn.following {
          color: var(--accent2);
        }
        .trend-item {
          padding: 8px 0;
          border-bottom: 1px solid var(--trend-border);
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.3s;
        }
        .trend-item:hover {
          color: var(--text);
        }
        .cta {
          margin: 0 80px 100px;
          border-radius: 32px;
          padding: 72px 80px;
          text-align: center;
          background: linear-gradient(135deg, rgba(197,169,122,0.12), rgba(122,184,197,0.08), rgba(167,143,197,0.10)),
                      radial-gradient(ellipse at top, rgba(255,255,255,0.1), transparent 70%);
          position: relative;
        }
        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .cta-eyebrow {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 24px;
        }
        .cta-title {
          font-family: var(--font-serif);
          font-size: 36px;
          margin-bottom: 16px;
        }
        .cta-title .italic {
          font-style: italic;
          color: var(--accent2);
        }
        .cta-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }
        .footer {
          padding: 48px 80px;
          border-top: 1px solid var(--footer-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-logo img {
          height: 56px;
          width: auto;
        }
        .footer-logo-text {
          font-family: var(--font-serif);
          font-size: 20px;
          color: var(--accent);
        }
        .footer-links {
          display: flex;
          gap: 24px;
        }
        .footer-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-link:hover {
          color: var(--text);
        }
        .footer-copy {
          color: var(--footer-copy);
          font-size: 14px;
        }
        .theme-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: all 0.3s;
          z-index: 999;
          animation: fabPop 0.5s 0.8s both;
        }
        @keyframes fabPop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .theme-fab:hover {
          transform: scale(1.12);
        }
        .theme-fab:active {
          transform: scale(0.95);
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(197,169,122,0.3);
          border-radius: 4px;
        }
        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 60px 40px;
          }
          .hero-right {
            display: none;
          }
          .features {
            padding: 60px 40px;
          }
          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .feed {
            grid-template-columns: 1fr;
            padding: 60px 40px;
          }
        }
        @media (max-width: 700px) {
          .navbar {
            padding: 0 20px;
          }
          .nav-links {
            display: none;
          }
          .search-bar {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .features {
            padding: 40px 20px;
          }
          .feature-grid {
            grid-template-columns: 1fr;
          }
          .feed {
            padding: 40px 20px;
          }
          .cta {
            margin: 0 20px 60px;
            padding: 48px 24px;
          }
          .footer {
            padding: 32px 20px;
            flex-direction: column;
            gap: 24px;
          }
        }
      `}</style>
      <div className="bg-canvas"></div>
      <div>
      <nav className="navbar">
        <div className="logo">
          <div className="logo-glow"></div>
          <img src={isLight ? "/logobrightmode.png" : "/logo.png"} alt="JUssconnec" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Discover</a>
          <a href="#" className="nav-link">Network</a>
          <a href="#" className="nav-link">Opportunities</a>
          <a href="#" className="nav-link">Messages</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input type="text" placeholder="Search people, topics…" className="search-bar" />
          </div>
          <div className="notif-wrap">
            <button className="notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            {notifOpen && (
              <div className="notif-box">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mark all read</span>
                </div>
                <div className="notif-empty">
                  <div className="notif-empty-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                  <div className="notif-empty-text">You're all caught up!<br/>No new notifications.</div>
                </div>
              </div>
            )}
          </div>
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Join Free</button>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#" className="nav-link">Discover</a>
            <a href="#" className="nav-link">Network</a>
            <a href="#" className="nav-link">Opportunities</a>
            <a href="#" className="nav-link">Messages</a>
            <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>Join Free</button>
          </div>
        )}
      </nav>
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow">The Professional Universe</div>
          <h1 className="hero-title">
            Where <span className="italic">Ambition</span> Meets <span className="gradient">Opportunity</span>
          </h1>
          <p className="hero-subtitle">
            Connect with distinguished professionals worldwide. Build relationships that define careers and shape industries.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Start Connecting</button>
            <button className="btn-ghost">Explore Network</button>
          </div>
          <div className="stats">
            <div>
              <div className="stat-number">4.2M</div>
              <div className="stat-label">Professionals</div>
            </div>
            <div>
              <div className="stat-number">180+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div>
              <div className="stat-number">92K</div>
              <div className="stat-label">Open Roles</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="profile-card card-main">
            <div className="card-avatar">A</div>
            <div className="card-name">Anika Sharma</div>
            <div className="card-role">Senior Product Lead</div>
            <div className="card-tags">
              <span className="card-tag">Product</span>
              <span className="card-tag">FinTech</span>
            </div>
            <button className={`connect-btn ${connectedCards['anika'] ? 'connected' : ''}`} onClick={() => toggleConnect('anika')}>
              {connectedCards['anika'] ? '✓ Connected' : '+ Connect'}
            </button>
          </div>
          <div className="profile-card card-2">
            <div className="card-avatar">M</div>
            <div className="card-name">Marco Delvecchio</div>
            <div className="card-role">UX Architect</div>
            <div className="card-tags">
              <span className="card-tag">Design</span>
            </div>
            <button className={`connect-btn ${connectedCards['marco'] ? 'connected' : ''}`} onClick={() => toggleConnect('marco')}>
              {connectedCards['marco'] ? '✓ Connected' : '+ Connect'}
            </button>
          </div>
          <div className="profile-card card-3">
            <div className="card-avatar">S</div>
            <div className="card-name">Sara Al-Hassan</div>
            <div className="card-role">Venture Partner</div>
            <div className="card-tags">
              <span className="card-tag">VC</span>
              <span className="card-tag">Deep Tech</span>
            </div>
            <button className={`connect-btn ${connectedCards['sara'] ? 'connected' : ''}`} onClick={() => toggleConnect('sara')}>
              {connectedCards['sara'] ? '✓ Connected' : '+ Connect'}
            </button>
          </div>
          <div className="profile-card card-4">
            <div className="card-avatar" style={{ width: '38px', height: '38px', fontSize: '14px' }}>R</div>
            <div className="card-name" style={{ fontSize: '16px' }}>Ryo Tanaka</div>
            <div className="card-role" style={{ fontSize: '12px' }}>AI Researcher</div>
            <div className="card-tags">
              <span className="card-tag">AI/ML</span>
            </div>
            <button className={`connect-btn ${connectedCards['ryo'] ? 'connected' : ''}`} onClick={() => toggleConnect('ryo')}>
              {connectedCards['ryo'] ? '✓ Connected' : '+ Connect'}
            </button>
          </div>
          <div className="floating-badge badge-1">
            <span className="badge-dot"></span>Where ambition finds its tribe
          </div>
          <div className="floating-badge badge-2">
            <span className="badge-dot"></span>Your next chapter starts here
          </div>
        </div>
      </section>
      <section className="features">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-label">Why JUssconnec</div>
          <h2 className="section-title">Built for <span className="italic">Distinction</span></h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon gold">✦</div>
            <h3 className="feature-title">Curated Connections</h3>
            <p className="feature-desc">Intelligent matching algorithms surface the most relevant professionals for your network.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon teal">◈</div>
            <h3 className="feature-title">Deep Insights</h3>
            <p className="feature-desc">Advanced analytics provide valuable insights into industry trends and networking opportunities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">⬡</div>
            <h3 className="feature-title">Elevated Feed</h3>
            <p className="feature-desc">Curated content from thought leaders and industry experts keeps you informed and inspired.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon gold">❋</div>
            <h3 className="feature-title">Private Rooms</h3>
            <p className="feature-desc">Secure, private spaces for confidential discussions and deal-making.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon teal">◉</div>
            <h3 className="feature-title">Global Opportunities</h3>
            <p className="feature-desc">Access exclusive job opportunities and partnerships from around the world.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">⬟</div>
            <h3 className="feature-title">Reputation Layer</h3>
            <p className="feature-desc">Build and showcase your professional reputation with verified achievements.</p>
          </div>
        </div>
      </section>
      <section className="feed">
        <div className="feed-left">
          <div className="feed-title">Ideas in <span className="italic">Motion</span></div>
          <div className="post-card">
            <div className="post-header">
              <div className="post-avatar">A</div>
              <div>
                <div className="post-name">Anika Sharma</div>
                <div className="post-meta">Senior Product Lead · 2h ago</div>
              </div>
            </div>
            <div className="post-body">
              The future of product leadership isn't about managing features—it's about orchestrating ecosystems of innovation that create lasting value.
            </div>
            <div className="post-actions">
              <button className={`post-action ${likedPosts['post1'] ? 'liked' : ''}`} onClick={() => toggleLike('post1')}>
                {likedPosts['post1'] ? '♥' : '♡'} {likedPosts['post1'] ? 219 : 218}
              </button>
              <button className="post-action">◇ 42</button>
              <button className="post-action">↗ Share</button>
            </div>
          </div>
          <div className="post-card">
            <div className="post-header">
              <div className="post-avatar">M</div>
              <div>
                <div className="post-name">Marco Delvecchio</div>
                <div className="post-meta">UX Architect · 5h ago</div>
              </div>
            </div>
            <div className="post-body">
              Glassmorphism isn't just an aesthetic—it's a design philosophy that embraces transparency, depth, and human-centered interaction.
            </div>
            <div className="post-actions">
              <button className={`post-action ${likedPosts['post2'] ? 'liked' : ''}`} onClick={() => toggleLike('post2')}>
                {likedPosts['post2'] ? '♥' : '♡'} {likedPosts['post2'] ? 462 : 461}
              </button>
              <button className="post-action">◇ 87</button>
              <button className="post-action">↗ Share</button>
            </div>
          </div>
          <div className="post-card">
            <div className="post-header">
              <div className="post-avatar">S</div>
              <div>
                <div className="post-name">Sara Al-Hassan</div>
                <div className="post-meta">Venture Partner · 8h ago</div>
              </div>
            </div>
            <div className="post-body">
              The next unicorn isn't built on a single innovation—it's forged in the fires of persistent iteration and unwavering vision.
            </div>
            <div className="post-actions">
              <button className={`post-action ${likedPosts['post3'] ? 'liked' : ''}`} onClick={() => toggleLike('post3')}>
                {likedPosts['post3'] ? '♥' : '♡'} {likedPosts['post3'] ? 893 : 892}
              </button>
              <button className="post-action">◇ 156</button>
              <button className="post-action">↗ Share</button>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">People to Connect</h3>
            <div className="connect-item">
              <div className="connect-avatar">L</div>
              <div>
                <div className="connect-name">Lena Müller</div>
                <div className="connect-role">Berlin, DE</div>
              </div>
              <button className={`follow-btn ${following['lena'] ? 'following' : ''}`} onClick={() => toggleFollow('lena')}>
                {following['lena'] ? '✓ Following' : '+ Follow'}
              </button>
            </div>
            <div className="connect-item">
              <div className="connect-avatar">J</div>
              <div>
                <div className="connect-name">Jamal Osei</div>
                <div className="connect-role">Lagos, NG</div>
              </div>
              <button className={`follow-btn ${following['jamal'] ? 'following' : ''}`} onClick={() => toggleFollow('jamal')}>
                {following['jamal'] ? '✓ Following' : '+ Follow'}
              </button>
            </div>
            <div className="connect-item">
              <div className="connect-avatar">P</div>
              <div>
                <div className="connect-name">Priya Menon</div>
                <div className="connect-role">Mumbai, IN</div>
              </div>
              <button className={`follow-btn ${following['priya'] ? 'following' : ''}`} onClick={() => toggleFollow('priya')}>
                {following['priya'] ? '✓ Following' : '+ Follow'}
              </button>
            </div>
          </div>
          <div className="sidebar-widget">
            <h3 className="widget-title">Trending Topics</h3>
            <a href="#" className="trend-item">#AIProductStrategy 4,200 posts</a>
            <a href="#" className="trend-item">#VentureCapital2026 2,890 posts</a>
            <a href="#" className="trend-item">#LiquidUX 1,670 posts</a>
            <a href="#" className="trend-item">#FutureOfWork 3,110 posts</a>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="cta-eyebrow">Join the Elite Network</div>
        <h2 className="cta-title">Your Network Is <span className="italic">Your Net Worth</span></h2>
        <p className="cta-subtitle">
          Join millions of distinguished professionals building the relationships that define the next chapter of their careers.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Create Free Account</button>
          <button className="btn-ghost">See How It Works</button>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-logo">
          <img src={isLight ? "/logobrightmode.png" : "/logo.png"} alt="JUssconnec" className="logo-img" />
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Careers</a>
          <a href="#" className="footer-link">Blog</a>
          <a href="#" className="footer-link">Help</a>
        </div>
        <div className="footer-copy">© 2026 JUssconnec. All rights reserved.</div>
      </footer>
      </div>
      <button className="theme-fab" onClick={() => setIsLight(!isLight)}>
        {isLight ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </button>
    </>
  );
};

export default Landing;

