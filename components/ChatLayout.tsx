import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { User, ChatSession, ChatTab } from '../types';
import { UserContext } from '../context/UserContext';
import useLocalStorage from '../hooks/useLocalStorage';
import ChatWindow from './ChatWindow';
import NewChatModal from './NewChatModal';
import { PlusIcon } from './icons/PlusIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const ChatLayout: React.FC = () => {
  const { user } = useContext(UserContext);
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useLocalStorage<ChatTab[]>(`boozbaal-chat-tabs-${user?.id}`, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If a chatId is in the URL but not in our tabs, add it.
    // This happens when a user follows an invitation link.
    if (chatId && user && !tabs.some(tab => tab.chatId === chatId)) {
        const chatSessionJson = localStorage.getItem(`boozbaal-chat-session-${chatId}`);
        if (chatSessionJson) {
            const chatSession: ChatSession = JSON.parse(chatSessionJson);
            const participant = chatSession.participants.find(p => p.id !== user.id);
            if (participant) {
                setTabs([...tabs, { chatId, participant }]);
            }
        }
    }
  }, [chatId, user, tabs, setTabs]);

  const handleCreateChat = (invitee: User) => {
    if (!user) return;
    const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newChatSession: ChatSession = {
      id: newChatId,
      participants: [user, invitee],
      messages: [],
    };
    localStorage.setItem(`boozbaal-chat-session-${newChatId}`, JSON.stringify(newChatSession));
    
    setTabs([...tabs, { chatId: newChatId, participant: invitee }]);
    setIsModalOpen(false);
    navigate(`/chat/${newChatId}`);
    return `${window.location.origin}${window.location.pathname}#/chat/${newChatId}`;
  };

  const closeTab = (e: React.MouseEvent, tabIdToClose: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.chatId !== tabIdToClose);
    setTabs(newTabs);
    if (chatId === tabIdToClose) {
      if (newTabs.length > 0) {
        navigate(`/chat/${newTabs[0].chatId}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-800">
      <div className="flex flex-col w-full">
        {/* Tab Bar */}
        <div className="flex items-center bg-gray-900 border-b border-gray-700">
          <nav className="flex-1 flex space-x-1 p-1">
            {tabs.map((tab) => (
              <div
                key={tab.chatId}
                onClick={() => navigate(`/chat/${tab.chatId}`)}
                className={`flex items-center cursor-pointer px-4 py-2 rounded-t-md transition-colors duration-200 group ${
                  chatId === tab.chatId ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
                }`}
              >
                <span>{tab.participant.name}</span>
                <button onClick={(e) => closeTab(e, tab.chatId)} className="ml-3 p-0.5 rounded-full hover:bg-gray-600 opacity-50 group-hover:opacity-100 transition-opacity">
                   <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </nav>
          <button onClick={() => setIsModalOpen(true)} className="p-2 m-1 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <PlusIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto">
          {chatId ? (
            <ChatWindow key={location.pathname} chatId={chatId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <h2 className="text-2xl font-semibold">Welcome to Boozbaal Chat</h2>
                <p className="mt-2">Select a chat or start a new one.</p>
            </div>
          )}
        </main>
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
};

export default ChatLayout;