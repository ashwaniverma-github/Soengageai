"use client";

import { useState } from "react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
}

export default function MessageModal({ isOpen, onClose, onSend }: MessageModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await onSend(message);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold text-white mb-4">Send Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 resize-none h-32 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
