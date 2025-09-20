import React, { useState } from 'react';
import { User } from '../types';
import { UserIcon } from './icons/UserIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Welcome to Boozbaal Chat
          </h1>
          <p className="mt-2 text-gray-400">Please enter your details to start chatting.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <UserIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;