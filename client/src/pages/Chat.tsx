import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthProtected from '@/components/AuthProtected';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import MessageForm from '@/components/MessageForm';
import { useQuery } from '@tanstack/react-query';
import { UserMessage } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showTyping, setShowTyping] = useState(false);
  
  const partnerName = user?.gender === 'male' ? 'Ananya' : 'Rahul';
  const partnerImage = user?.gender === 'male' 
    ? 'https://randomuser.me/api/portraits/women/65.jpg' 
    : 'https://randomuser.me/api/portraits/men/32.jpg';

  const { data: messages, isLoading } = useQuery<UserMessage[]>({
    queryKey: ['/api/user-messages'],
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    // Show typing indicator when user sends a message
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isUserMessage) {
        setShowTyping(true);
        const timer = setTimeout(() => {
          setShowTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  return (
    <AuthProtected>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        {/* Chat Header */}
        <header className="bg-gradient-love text-white shadow-lg">
          <div className="container mx-auto p-4 flex items-center">
            <Button variant="ghost" size="icon" className="text-white mr-4" asChild>
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
            
            <img 
              src={partnerImage} 
              alt={partnerName} 
              className="w-10 h-10 rounded-full border-2 border-white" 
            />
            
            <div className="ml-3">
              <h3 className="text-white font-semibold">{partnerName}</h3>
              <p className="text-white text-opacity-80 text-xs">Online now</p>
            </div>
            
            <div className="ml-auto flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white">
                <Phone size={20} />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-white">
                <Video size={20} />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Chat Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div className="text-center text-neutral-500 text-sm mb-6">
            Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse flex flex-col space-y-4 w-full max-w-md">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 ml-auto"></div>
                <div className="h-10 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : (
            <>
              {messages && messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              
              {showTyping && <TypingIndicator />}
            </>
          )}
        </div>
        
        {/* Chat Input */}
        <MessageForm />
        
        {/* Premium Upgrade Banner */}
        {user && !user.isPremium && (
          <div className="bg-gradient-to-r from-secondary to-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Unlock premium features</p>
                <p className="text-sm text-white text-opacity-80">Get deeper conversations and special messages</p>
              </div>
              <Button asChild className="bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-full text-sm font-medium">
                <Link href="/premium">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthProtected>
  );
};

export default Chat;
