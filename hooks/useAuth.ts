import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, callbackUrl?: string) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl || '/account',
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true, url: result?.url };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login after registration
      return await login(userData.email, userData.password);
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading' || isLoading,
    login,
    logout,
    register,
    isAdmin: session?.user?.role === 'ADMIN',
    isManager: session?.user?.role === 'MANAGER',
  };
};
