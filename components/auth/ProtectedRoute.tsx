import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace(`/auth/signin?callbackUrl=${router.asPath}`);
      return;
    }

    if (adminOnly && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      router.replace('/account');
      return;
    }
  }, [session, status, router, adminOnly]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (adminOnly && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
    return null;
  }

  return <>{children}</>;
};
