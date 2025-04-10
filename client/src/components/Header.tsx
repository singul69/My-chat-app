import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-gradient-love text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold font-sans cursor-pointer">LoveChat</h1>
        </Link>
        
        <div className="flex space-x-3">
          {user ? (
            <>
              {user.isAdmin && (
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <Link href="/chat">Chat</Link>
              </Button>
              
              {!user.isPremium && (
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  <Link href="/premium">Premium</Link>
                </Button>
              )}
              
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <Link href="/login">Login</Link>
              </Button>
              
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
