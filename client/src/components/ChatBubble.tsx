import React from 'react';
import { UserMessage } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: UserMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isUserMessage = message.isUserMessage;
  
  // Get partner name based on user gender
  const partnerName = user?.gender === 'male' ? 'Ananya' : 'Rahul';
  const partnerImage = user?.gender === 'male' 
    ? 'https://randomuser.me/api/portraits/women/65.jpg' 
    : 'https://randomuser.me/api/portraits/men/32.jpg';

  const timeString = message.createdAt 
    ? format(new Date(message.createdAt), 'h:mm a') 
    : '';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUserMessage && (
        <img 
          src={partnerImage} 
          alt={partnerName} 
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}
      
      <div className={`
        p-3 rounded-lg shadow-sm max-w-[80%] 
        ${isUserMessage 
          ? 'bg-primary text-white chat-bubble-right' 
          : 'bg-white text-neutral-dark chat-bubble-left'}
      `}>
        <p>{message.message}</p>
        
        {/* Display image if present */}
        {!isUserMessage && message.imageUrl && (
          <div className="mt-2 mb-1">
            <img 
              src={message.imageUrl} 
              alt="Shared image" 
              className="rounded-md max-w-full max-h-60 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <p className={`text-xs mt-1 ${isUserMessage ? 'text-white text-opacity-80' : 'text-neutral-medium'}`}>
          {timeString}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
