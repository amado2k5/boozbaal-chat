import React, { useContext, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ChatSession, Message, User } from '../types';
import { UserContext } from '../context/UserContext';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { user } = useContext(UserContext);
  const [session, setSession] = useLocalStorage<ChatSession | null>(`boozbaal-chat-session-${chatId}`, null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = session?.participants.find(p => p.id !== user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);


  const handleSendMessage = (content: string) => {
    if (!user || !session) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      content,
      timestamp: Date.now(),
    };

    setSession({
      ...session,
      messages: [...session.messages, newMessage],
    });
  };

  if (!session) {
    return (
        <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading chat or chat not found...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <header className="p-4 bg-gray-900 border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-white">Chat with {otherParticipant?.name || '...'}</h2>
        <p className="text-sm text-gray-400">{otherParticipant?.email}</p>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {session.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUser={user!} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} messages={session.messages}/>
      </div>
    </div>
  );
};

export default ChatWindow;