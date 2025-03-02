"use client";

import { useState, useEffect, useRef } from "react";
import { CircleArrowUp } from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  displayText: string;
}

interface ChatWindowProps {
  influencerId: string;
  onClose: () => void;
}
const formatResponseText = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-purple-300">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="text-gray-300 italic">{part.slice(1, -1)}</em>;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

export default function ChatWindow({ influencerId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(chatEndRef.current){
        chatEndRef.current.scrollIntoView({behavior:'smooth'})
    }
  },[messages])
  // Typing effect implementation
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.sender === 'ai' && lastMessage.displayText.length < lastMessage.text.length) {
      const timer = setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          newMessages[lastMsgIndex] = {
            ...newMessages[lastMsgIndex],
            displayText: lastMessage.text.slice(0, lastMessage.displayText.length + 1)
          };
          return newMessages;
        });
      }, 20);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      sender: "user",
      text: input,
      displayText: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (influencerId.toLowerCase() !== "donna") return;

    try {
      const res = await fetch("/api/ai/donna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const aiMessage: ChatMessage = {
          sender: "ai",
          text: data.response,
          displayText: "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-purple-950 text-white">
        <h2 className="text-xl font-bold">Chat with {influencerId}</h2>
        <button
          onClick={onClose}
          className="p-2  rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.sender === "user" 
                ? "bg-purple-800 text-white" 
                : "bg-gray-800 text-gray-100 shadow-md"}`}>
              <div className="break-words">
                {formatResponseText(msg.displayText)}
                {msg.sender === 'ai' && msg.displayText.length < msg.text.length && (
                  <span className="ml-1 inline-block w-2 h-4 bg-gray-100 animate-blink" />
                )}
              </div>
              <p className={`text-xs mt-1 ${
                msg.sender === "user" ? "text-purple-300" : "text-gray-400"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([],{hour:'2-digit' , minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex gap-2">
          <textarea
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 resize-none p-3 rounded-full focus:outline-none bg-gray-800 text-gray-100 placeholder-gray-400"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 h-auto rounded-full bg-purple-700 hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CircleArrowUp className="w-6 h-6 text-gray-100" />
          </button>
        </div>
      </div>
    </div>
  );
}