import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtected;
