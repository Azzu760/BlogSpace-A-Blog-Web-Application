import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock JWT token generation
      const mockToken = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      dispatch(setCredentials({ user: mockUser, token: mockToken }));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to your dashboard.",
      });
      
      navigate('/admin/dashboard');
      return { success: true };
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockToken = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
      const mockUser = {
        id: Date.now().toString(),
        email,
        name,
      };

      dispatch(setCredentials({ user: mockUser, token: mockToken }));
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      
      navigate('/admin/dashboard');
      return { success: true };
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
