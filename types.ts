
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  participants: User[];
  messages: Message[];
}

export interface ChatTab {
    chatId: string;
    participant: User;
}
