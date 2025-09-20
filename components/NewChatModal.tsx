
import React, { useState, Fragment } from 'react';
import { User } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { UserIcon } from './icons/UserIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';


interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (invitee: User) => string | undefined;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onCreateChat }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      const invitee: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
      };
      const link = onCreateChat(invitee);
      if (link) {
        setGeneratedLink(link);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleClose = () => {
    setName('');
    setEmail('');
    setGeneratedLink('');
    setIsCopied(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity" onClick={handleClose}>
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg relative border border-gray-700" onClick={e => e.stopPropagation()}>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <XMarkIcon className="h-6 w-6"/>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Start a New Chat</h2>
            
            {!generatedLink ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Invitee's Name</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Invitee's Email</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john.doe@example.com"
                                required
                                className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition">
                        Generate Invitation Link
                    </button>
                </form>
            ) : (
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-green-400">Invitation Link Ready!</h3>
                    <p className="text-gray-300">Share this link with {name} to start chatting.</p>
                    <div className="flex items-center space-x-2 bg-gray-900 p-3 rounded-md border border-gray-600">
                        <input type="text" readOnly value={generatedLink} className="flex-1 bg-transparent text-gray-400 outline-none"/>
                        <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md transition">
                            <ClipboardIcon className="h-4 w-4 mr-2"/>
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default NewChatModal;
