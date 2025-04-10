import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] chat-bubble-left">
        <div className="typing-animation flex items-center space-x-1">
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
