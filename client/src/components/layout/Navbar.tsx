import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <Heart className="text-primary-500 h-6 w-6 mr-2" />
                <span className="font-serif text-primary-600 text-xl font-bold">LoveChat</span>
              </a>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/">
              <a className={`${location === '/' ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'} px-3 py-2 text-sm font-medium`}>
                Home
              </a>
            </Link>
            <Link href="/chat">
              <a className={`${location === '/chat' ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'} px-3 py-2 text-sm font-medium`}>
                Chat
              </a>
            </Link>
            <Link href="/premium">
              <a className={`${location === '/premium' ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'} px-3 py-2 text-sm font-medium`}>
                Premium
              </a>
            </Link>
            
            {user?.isAdmin && (
              <Link href="/admin">
                <a className={`${location === '/admin' ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'} px-3 py-2 text-sm font-medium`}>
                  Admin
                </a>
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={() => logout()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <a>
                    <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                      Login
                    </Button>
                  </a>
                </Link>
                <Link href="/auth?tab=register">
                  <a>
                    <Button className="bg-primary-600 text-white hover:bg-primary-700">
                      Register
                    </Button>
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
