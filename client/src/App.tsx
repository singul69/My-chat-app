import React from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Chat from "@/pages/Chat";
import Premium from "@/pages/Premium";
import Admin from "@/pages/Admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home as HomeIcon, MessageSquare, Heart, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function MobileNavItem({ to, icon, label, isActive }: MobileNavItemProps) {
  const [_, navigate] = useLocation();
  
  return (
    <Button 
      variant="ghost" 
      className={`flex flex-col items-center justify-center h-16 rounded-none ${isActive ? 'text-primary' : 'text-neutral-500'}`}
      onClick={() => navigate(to)}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Button>
  );
}

function Router() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Check if we're on a page that should show the bottom nav
  const showBottomNav = user && !['/login', '/register'].includes(location);
  
  return (
    <div className="app-container">
      <Header />
      
      <main className="app-screen">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/chat" component={Chat} />
          <Route path="/premium" component={Premium} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {showBottomNav && (
        <div className="bottom-nav">
          <MobileNavItem
            to="/"
            icon={<HomeIcon className="h-6 w-6" />}
            label="Home"
            isActive={location === '/'}
          />
          <MobileNavItem
            to="/chat"
            icon={<MessageSquare className="h-6 w-6" />}
            label="Chat"
            isActive={location === '/chat'}
          />
          <MobileNavItem
            to="/premium"
            icon={<Heart className="h-6 w-6" />}
            label="Premium"
            isActive={location === '/premium'}
          />
          {user?.isAdmin && (
            <MobileNavItem
              to="/admin"
              icon={<Settings className="h-6 w-6" />}
              label="Admin"
              isActive={location === '/admin'}
            />
          )}
          <MobileNavItem
            to="/profile"
            icon={<User className="h-6 w-6" />}
            label={user?.isAdmin ? "Profile" : "Profile"}
            isActive={location === '/profile'}
          />
        </div>
      )}
      
      {!showBottomNav && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
