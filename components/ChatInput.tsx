
import React, { useState } from 'react';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { FaceSmileIcon } from './icons/FaceSmileIcon';
import { suggestReply } from '../services/geminiService';
import { Message } from '../types';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  messages: Message[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, messages }) => {
  const [content, setContent] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleSuggestReply = async () => {
    setIsSuggesting(true);
    try {
      const suggestion = await suggestReply(messages);
      setContent(suggestion);
    } catch (error) {
      console.error("Failed to suggest reply", error);
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="relative flex-1">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pr-28 pl-12 text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                style={{ minHeight: '52px', maxHeight: '200px' }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
            />
            <div className="absolute left-3 bottom-3.5 flex space-x-2">
                <button type="button" onClick={() => setIsEmojiPickerOpen(prev => !prev)} className="text-gray-400 hover:text-indigo-400">
                    <FaceSmileIcon className="h-6 w-6" />
                </button>
                 {isEmojiPickerOpen && (
                    <div className="absolute bottom-full mb-2">
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </div>
                )}
            </div>
            <div className="absolute right-3 bottom-3.5 flex space-x-2">
                <button
                    type="button"
                    onClick={handleSuggestReply}
                    disabled={isSuggesting}
                    className="text-gray-400 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className={`h-6 w-6 ${isSuggesting ? 'animate-pulse' : ''}`} />
                </button>
            </div>
        </div>
      <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50" disabled={!content.trim()}>
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
    </form>
  );
};

export default ChatInput;
