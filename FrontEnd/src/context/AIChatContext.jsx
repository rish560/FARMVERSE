import { createContext, useContext, useState } from 'react';

const AIChatContext = createContext(null);

export const AIChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    toggleChat: () => setIsOpen((v) => !v),
  };

  return <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>;
};

export const useAIChat = () => useContext(AIChatContext);
