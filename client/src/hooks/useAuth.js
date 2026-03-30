import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (result.meta.requestStatus === 'fulfilled') {
      const u = result.payload.user;
      navigate(u.completedProfile ? '/feed' : '/complete-profile');
    }
    return result;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/complete-profile');
    }
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const resetError = () => dispatch(clearError());

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    login,
    register,
    logout,
    resetError,
  };
};
