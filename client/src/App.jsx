import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Search from './pages/Search';
import Settings from './pages/Settings';

// Route guards
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// Hooks
import { useSocket } from './hooks/useSocket';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Initialize socket connection when user is authenticated
  useSocket(user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private Routes with Layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/network" element={<Network />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
