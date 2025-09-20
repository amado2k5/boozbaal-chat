import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { User } from './types';
import { UserContext } from './context/UserContext';
import useLocalStorage from './hooks/useLocalStorage';
import Login from './components/Login';
import ChatLayout from './components/ChatLayout';

function App() {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('boozbaal-chat-user', null);
  const [currentUser, setCurrentUser] = useState<User | null>(storedUser);

  const handleLogin = (user: User) => {
    setStoredUser(user);
    setCurrentUser(user);
  };

  const userContextValue = useMemo(() => ({ user: currentUser, setUser: setCurrentUser }), [currentUser]);

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="h-screen w-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
        {!currentUser ? (
          <Login onLogin={handleLogin} />
        ) : (
          <HashRouter>
            <Routes>
              <Route path="/chat/:chatId" element={<ChatLayout />} />
              <Route path="/" element={<ChatLayout />} />
            </Routes>
          </HashRouter>
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;