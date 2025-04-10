import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Link href="/">
          <a 
            className={`${location === '/' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 border-l-4 border-transparent'} block pl-3 pr-4 py-2 text-base font-medium`}
            onClick={handleLinkClick}
          >
            Home
          </a>
        </Link>
        <Link href="/chat">
          <a 
            className={`${location === '/chat' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 border-l-4 border-transparent'} block pl-3 pr-4 py-2 text-base font-medium`}
            onClick={handleLinkClick}
          >
            Chat
          </a>
        </Link>
        <Link href="/premium">
          <a 
            className={`${location === '/premium' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 border-l-4 border-transparent'} block pl-3 pr-4 py-2 text-base font-medium`}
            onClick={handleLinkClick}
          >
            Premium
          </a>
        </Link>
        
        {user?.isAdmin && (
          <Link href="/admin">
            <a 
              className={`${location === '/admin' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 border-l-4 border-transparent'} block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={handleLinkClick}
            >
              Admin
            </a>
          </Link>
        )}
      </div>
      
      {isAuthenticated ? (
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.name}</div>
              <div className="text-sm font-medium text-gray-500">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Button 
              variant="ghost" 
              className="block w-full text-left px-4 py-2 text-base text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-4 pb-3 border-t border-gray-200 px-4 flex flex-col space-y-2">
          <Link href="/auth">
            <a onClick={handleLinkClick}>
              <Button variant="outline" className="w-full border-primary-600 text-primary-600">
                Login
              </Button>
            </a>
          </Link>
          <Link href="/auth?tab=register">
            <a onClick={handleLinkClick}>
              <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                Register
              </Button>
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
