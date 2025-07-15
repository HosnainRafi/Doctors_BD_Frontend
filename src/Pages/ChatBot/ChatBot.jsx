import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "Thanks! We'll suggest doctors soon." },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-800"
        >
          <FiMessageCircle className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="mt-2 w-80 h-[420px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-purple-700 text-white p-4 font-semibold text-lg flex justify-between items-center">
            <span>💬 CarePoint Bot</span>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm max-w-[75%] px-3 py-2 rounded-xl ${
                  msg.sender === 'bot'
                    ? 'bg-gray-200 text-left'
                    : 'bg-purple-700 text-white self-end ml-auto text-right'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center border-t p-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 p-2 text-purple-700 hover:text-purple-900"
            >
              <SendHorizonal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
