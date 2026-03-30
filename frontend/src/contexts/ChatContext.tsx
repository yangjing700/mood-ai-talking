import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
  memory?: string;
  mode?: "emotion" | "demon" | "angel";
}

interface ChatContextType {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Omit<Message, "id">) => void;
  mode: "emotion" | "demon" | "angel";
  setMode: (mode: "emotion" | "demon" | "angel") => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content: "嘿，今天过得怎么样？",
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mode: "emotion",
    },
  ]);
  const [mode, setMode] = useState<"emotion" | "demon" | "angel">("emotion");

  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage = {
      ...message,
      id: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, addMessage, mode, setMode }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
