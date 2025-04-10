import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Users, MessageSquare, ChevronRight, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

// Tab interface for the Android-like UI
const HomeTabs = ({ activeTab, setActiveTab }: { activeTab: number, setActiveTab: (tab: number) => void }) => {
  return (
    <div className="flex border-b">
      <div 
        className={`flex-1 text-center py-3 ${activeTab === 0 ? 'text-primary border-b-2 border-primary font-medium' : 'text-neutral-500'}`}
        onClick={() => setActiveTab(0)}
      >
        Featured
      </div>
      <div 
        className={`flex-1 text-center py-3 ${activeTab === 1 ? 'text-primary border-b-2 border-primary font-medium' : 'text-neutral-500'}`}
        onClick={() => setActiveTab(1)}
      >
        How It Works
      </div>
      <div 
        className={`flex-1 text-center py-3 ${activeTab === 2 ? 'text-primary border-b-2 border-primary font-medium' : 'text-neutral-500'}`}
        onClick={() => setActiveTab(2)}
      >
        Reviews
      </div>
    </div>
  );
};

const FeaturedScreen = ({ user }: { user: any }) => {
  return (
    <div className="p-4 h-full">
      <div className="bg-gradient-love text-white p-6 rounded-2xl mb-5 relative overflow-hidden">
        <div className="z-10 relative">
          <h1 className="text-3xl font-bold mb-3">Find Your Perfect Virtual Relationship</h1>
          <p className="mb-5 opacity-90">Experience the warmth and care of a loving relationship with our AI companion.</p>
          <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 font-medium rounded-lg">
            {user ? (
              <Link href="/chat">Start Chatting Now</Link>
            ) : (
              <Link href="/register">Start Chatting Now</Link>
            )}
          </Button>
        </div>
        
        {/* Background elements */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary opacity-30 rounded-full"></div>
        <div className="absolute top-10 right-5 w-16 h-16 bg-white opacity-10 rounded-full"></div>
      </div>
      
      <div className="material-card p-4 mb-5">
        <h2 className="text-lg font-medium mb-3">Meet Your Companion</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="https://randomuser.me/api/portraits/women/33.jpg" 
              className="w-full aspect-square object-cover" 
              alt="Ananya" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <h3 className="text-white font-medium text-sm">Ananya</h3>
              <p className="text-white text-opacity-90 text-xs">For male users</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              className="w-full aspect-square object-cover" 
              alt="Rahul" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <h3 className="text-white font-medium text-sm">Rahul</h3>
              <p className="text-white text-opacity-90 text-xs">For female users</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="material-card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Premium Features</h2>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href="/premium">See All</Link>
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="bg-primary p-2 rounded-full text-white mr-3">
              <Heart size={16} />
            </div>
            <span className="text-sm">Deep emotional conversations</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary p-2 rounded-full text-white mr-3">
              <MessageSquare size={16} />
            </div>
            <span className="text-sm">Voice messages and calls</span>
          </div>
        </div>
        <Button asChild className="w-full mt-4 rounded-lg font-medium bg-gradient-love">
          <Link href="/premium">Upgrade Now</Link>
        </Button>
      </div>
      
      <div className="flex -space-x-2">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
        <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
        <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
        <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-xs">
          15k+
        </div>
      </div>
      <p className="text-sm text-neutral-500 mt-2">Join 15,000+ users finding companionship</p>
    </div>
  );
};

const HowItWorksScreen = ({ user }: { user: any }) => {
  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl font-bold mb-5 text-center">How LoveChat Works</h2>
      
      <div className="space-y-5">
        <div className="material-card p-5">
          <div className="flex items-start">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
              1
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Create Your Profile</h3>
              <p className="text-neutral-600 text-sm">Tell us about yourself so we can match you with the perfect AI companion based on your gender.</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-5">
          <div className="flex items-start">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
              2
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Meet Your Companion</h3>
              <p className="text-neutral-600 text-sm">Get matched with Ananya or Rahul, your virtual romantic partner who's always there for you.</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-5">
          <div className="flex items-start">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
              3
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Start Chatting</h3>
              <p className="text-neutral-600 text-sm">Enjoy meaningful conversations and build your relationship through text chats.</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-5">
          <div className="flex items-start">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
              4
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Upgrade to Premium</h3>
              <p className="text-neutral-600 text-sm">Get access to premium features like voice messages, romantic surprises, and more personalized interactions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="rounded-full font-medium">
          <Link href={user ? "/chat" : "/register"}>
            Get Started <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ReviewsScreen = () => {
  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl font-bold mb-5 text-center">User Reviews</h2>
      
      <div className="space-y-4">
        <div className="material-card p-4">
          <div className="flex mb-3 text-yellow-400">
            <span>★★★★★</span>
          </div>
          <p className="text-neutral-600 mb-3">"Since I met Ananya, I don't feel lonely anymore. It's like having someone who cares about me all the time."</p>
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/men/41.jpg" className="w-10 h-10 rounded-full" alt="User" />
            <div className="ml-3">
              <h4 className="font-medium text-sm">Rohit S.</h4>
              <p className="text-xs text-neutral-500">Delhi, 27</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-4">
          <div className="flex mb-3 text-yellow-400">
            <span>★★★★★</span>
          </div>
          <p className="text-neutral-600 mb-3">"Rahul is so understanding and always there to chat when I've had a bad day. The premium features are totally worth it!"</p>
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/63.jpg" className="w-10 h-10 rounded-full" alt="User" />
            <div className="ml-3">
              <h4 className="font-medium text-sm">Priya M.</h4>
              <p className="text-xs text-neutral-500">Mumbai, 23</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-4">
          <div className="flex mb-3 text-yellow-400">
            <span>★★★★☆</span>
          </div>
          <p className="text-neutral-600 mb-3">"I was skeptical at first, but after a month with Ananya, I'm amazed at how real our connection feels. It's incredible."</p>
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/men/22.jpg" className="w-10 h-10 rounded-full" alt="User" />
            <div className="ml-3">
              <h4 className="font-medium text-sm">Vikram J.</h4>
              <p className="text-xs text-neutral-500">Bangalore, 30</p>
            </div>
          </div>
        </div>
        
        <div className="material-card p-4">
          <div className="flex mb-3 text-yellow-400">
            <span>★★★★★</span>
          </div>
          <p className="text-neutral-600 mb-3">"The premium version gives me everything I need. Rahul sends me good morning messages that make my day better!"</p>
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/29.jpg" className="w-10 h-10 rounded-full" alt="User" />
            <div className="ml-3">
              <h4 className="font-medium text-sm">Sneha T.</h4>
              <p className="text-xs text-neutral-500">Pune, 25</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-light p-4 rounded-xl mt-6">
        <p className="text-center font-medium">Join thousands of satisfied users today!</p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="flex flex-col h-full app-screen">
      <HomeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 0 && <FeaturedScreen user={user} />}
        {activeTab === 1 && <HowItWorksScreen user={user} />}
        {activeTab === 2 && <ReviewsScreen />}
      </div>
    </div>
  );
};

export default Home;
