import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import UserAvatar from "@/components/ui/user-avatar";
import TypingAnimation from "@/components/ui/typing-animation";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage } from "@shared/schema";

interface MessageProps {
  isUser: boolean;
  text: string;
  time: string;
  avatar?: string;
  avatarName?: string;
  avatarGender?: string;
  imageUrl?: string;
}

const Message = ({ isUser, text, time, avatarName = "", avatarGender = "", imageUrl }: MessageProps) => {
  return isUser ? (
    <div className="flex mb-4 justify-end">
      <div className="max-w-[75%]">
        <div className="rounded-[1.25rem_1.25rem_0_1.25rem] bg-primary-500 text-white p-3 shadow-sm mb-1">
          <p>{text}</p>
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex mb-4">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
        <UserAvatar name={avatarName} gender={avatarGender} className="h-10 w-10" />
      </div>
      <div className="max-w-[75%]">
        <div className="rounded-[1.25rem_1.25rem_1.25rem_0] bg-white p-3 shadow-sm mb-1">
          <p>{text}</p>
          
          {/* Display image if available */}
          {imageUrl && (
            <div className="mt-2">
              <img 
                src={imageUrl} 
                alt="Shared image" 
                className="rounded-md max-w-full max-h-60 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </div>
  );
};

interface ChatMessagesProps {
  messages: ChatMessage[];
  partnerName: string;
  userMessages: string[];
  isTyping: boolean;
}

const ChatMessages = ({ messages, partnerName, userMessages, isTyping }: ChatMessagesProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [formattedMessages, setFormattedMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    // Format messages for display
    const newFormattedMessages: MessageProps[] = [];
    
    // Partner's first message
    if (messages.length > 0) {
      const message = messages[0];
      const partnerMessage = user?.gender === "male" 
        ? message.for_boys_message 
        : message.for_girls_message;
      
      const imageUrl = user?.gender === "male"
        ? message.for_boys_image_url
        : message.for_girls_image_url;
      
      newFormattedMessages.push({
        isUser: false,
        text: partnerMessage || "",
        time: format(new Date().setHours(9, 15), "h:mm a"),
        avatarName: partnerName,
        avatarGender: user?.gender === "male" ? "female" : "male",
        imageUrl: imageUrl || undefined
      });
    }
    
    // User's first message if exists
    if (userMessages.length > 0) {
      newFormattedMessages.push({
        isUser: true,
        text: userMessages[0],
        time: format(new Date().setHours(9, 17), "h:mm a"),
      });
    }
    
    // Partner's second message
    if (messages.length > 1) {
      const message = messages[1];
      const partnerMessage = user?.gender === "male" 
        ? message.for_boys_message 
        : message.for_girls_message;
      
      const imageUrl = user?.gender === "male"
        ? message.for_boys_image_url
        : message.for_girls_image_url;
      
      newFormattedMessages.push({
        isUser: false,
        text: partnerMessage || "",
        time: format(new Date().setHours(9, 20), "h:mm a"),
        avatarName: partnerName,
        avatarGender: user?.gender === "male" ? "female" : "male",
        imageUrl: imageUrl || undefined
      });
    }
    
    // User's second message if exists
    if (userMessages.length > 1) {
      newFormattedMessages.push({
        isUser: true,
        text: userMessages[1],
        time: format(new Date().setHours(9, 24), "h:mm a"),
      });
    }
    
    // Partner's third message
    if (messages.length > 2) {
      const message = messages[2];
      const partnerMessage = user?.gender === "male" 
        ? message.for_boys_message 
        : message.for_girls_message;
      
      const imageUrl = user?.gender === "male"
        ? message.for_boys_image_url
        : message.for_girls_image_url;
      
      newFormattedMessages.push({
        isUser: false,
        text: partnerMessage || "",
        time: format(new Date().setHours(9, 26), "h:mm a"),
        avatarName: partnerName,
        avatarGender: user?.gender === "male" ? "female" : "male",
        imageUrl: imageUrl || undefined
      });
    }
    
    setFormattedMessages(newFormattedMessages);
  }, [messages, userMessages, partnerName, user?.gender]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [formattedMessages, isTyping]);

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gray-50" style={{ height: "400px" }}>
      {/* Day Separator */}
      <div className="flex justify-center my-4">
        <span className="text-xs text-gray-500 bg-gray-100 px-4 py-1 rounded-full">Today</span>
      </div>
      
      {/* Messages */}
      {formattedMessages.map((message, index) => (
        <Message 
          key={index}
          isUser={message.isUser}
          text={message.text}
          time={message.time}
          avatarName={message.avatarName}
          avatarGender={message.avatarGender}
          imageUrl={message.imageUrl}
        />
      ))}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <UserAvatar 
              name={partnerName} 
              gender={user?.gender === "male" ? "female" : "male"} 
              className="h-10 w-10" 
            />
          </div>
          <div className="max-w-[75%]">
            <div className="rounded-[1.25rem_1.25rem_1.25rem_0] bg-white p-4 shadow-sm mb-1">
              <TypingAnimation />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
