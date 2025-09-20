
import React from 'react';
import { Message, User } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.senderId === currentUser.id;

  const bubbleClasses = isCurrentUser
    ? 'bg-indigo-600 text-white self-end rounded-br-none'
    : 'bg-gray-700 text-gray-200 self-start rounded-bl-none';

  const containerClasses = isCurrentUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`max-w-md lg:max-w-xl px-4 py-3 rounded-xl shadow-md ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'} text-right`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
