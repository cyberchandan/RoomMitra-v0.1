import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, User } from 'lucide-react';

const InboxPage = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/chat/conversations/all');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Handle incoming messages for live update of inbox
  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000');
    newSocket.emit('join_chat', user._id);

    const receiveMessageHandler = () => {
      // Re-fetch conversations when a new message is received
      const reloadData = async () => {
        try {
          const { data } = await api.get('/chat/conversations/all');
          setConversations(data);
        } catch (error) {
          console.error(error);
        }
      };
      reloadData();
    };

    newSocket.on('receive_message', receiveMessageHandler);

    return () => {
      newSocket.off('receive_message', receiveMessageHandler);
      newSocket.disconnect();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-500 font-medium animate-pulse">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col card overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center gap-4 z-10 shadow-sm relative">
        <div>
          <h2 className="font-bold text-slate-800 text-xl">Messages</h2>
          <span className="text-xs text-slate-500 font-medium">Your recent conversations</span>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-4">
        {conversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-75">
            <MessageCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium">No messages yet.</p>
            <p className="text-sm">When you chat with users or owners, they will appear here.</p>
          </div>
        ) : (
          conversations.map((conv, index) => (
            <Link 
              key={index} 
              to={`/chat/${conv.user._id}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                conv.unread ? 'bg-white border-primary-200 shadow-md' : 'bg-white border-slate-200 hover:border-primary-300'
              }`}
            >
              <div className="bg-primary-100 p-3 rounded-full text-primary-600 border border-primary-200">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold truncate ${conv.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {conv.user.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
                    {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className={`text-sm truncate ${conv.unread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default InboxPage;
