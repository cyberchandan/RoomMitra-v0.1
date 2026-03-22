import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Send, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const ChatPage = () => {

  const location = useLocation();
  const userName = location.state?.name;

  const { userId: otherUserId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // ✅ username displaying 
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${otherUserId}`);
        setOtherUser(data);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    if (otherUserId) {
      fetchUser();
    }
  }, [otherUserId]);
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    if (user) {
      const newSocket = io('https://imaginative-recreation-production-d054.up.railway.app', {
        transports: ['websocket']
      });
  
      setSocket(newSocket);
  
      newSocket.on("connect", () => {
        console.log("Connected:", newSocket.id);
        newSocket.emit("join_chat", user._id);
      });
  
      return () => newSocket.disconnect();
    }
  }, [user]);

  // Handle incoming messages
  useEffect(() => {
    if (socket) {
      const receiveMessageHandler = (message) => {
        // Only append if the message is from the user we are currently chatting with
        if (message.sender === otherUserId || message.receiver === otherUserId) {
           setMessages((prev) => [...prev, message]);
        }
      };

      socket.on('receive_message', receiveMessageHandler);

      // Cleanup listener
      return () => {
        socket.off('receive_message', receiveMessageHandler);
      };
    }
  }, [socket, otherUserId]);

  // Fetch Chat History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get(`/chat/${otherUserId}`);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch chat history');
      }
    };
    if (user && otherUserId) {
      fetchHistory();
    }
  }, [otherUserId, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user._id,
      receiver: otherUserId,
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, messageData]);

    try {
      // Send to DB
      await api.post('/chat', { receiver: otherUserId, content: newMessage });
      // Emit via socket for real-time delivery
      socket?.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col card overflow-hidden border border-slate-200">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center gap-4 z-10 shadow-sm relative">
        <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-full text-primary-600 border border-primary-200">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
             <h2 className="font-bold text-slate-800">
             Chat with {userName || otherUser?.name || "😎"} 😇
</h2>
             <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-500 inline-block animate-pulse"></span>
                Online
             </span>
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-75">
            <MessageCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium">No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === user._id;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-primary-600 text-white rounded-tr-sm border border-primary-700 font-medium' 
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="bg-white p-4 border-t border-slate-200 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <input
          type="text"
          className="input-field flex-1 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="btn-primary rounded-xl px-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-primary-500/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

// Also import MessageCircle for empty state icon
import { MessageCircle } from 'lucide-react';
export default ChatPage;
