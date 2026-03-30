import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image, Smile, Search, ArrowLeft, MoreVertical, Check, CheckCheck } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { SkeletonCard } from '../components/common/Skeleton';
import {
  fetchConversations, fetchMessages, sendMessage,
  setActiveChat, addMessage, setTyping,
} from '../features/messages/messagesSlice';
import { formatDate } from '../utils/helpers';
import { getSocket } from '../hooks/useSocket';

const Messages = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, activeChat, typingUsers, isLoading } = useSelector((state) => state.messages);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveChat(conv.participant._id || conv.participant));
    dispatch(fetchMessages(conv.participant._id || conv.participant));
    setShowMobileChat(true);
  };

  const handleSend = async () => {
    if (!messageText.trim() || !activeChat.userId) return;
    const socket = getSocket();
    if (socket) socket.emit('chat:stop-typing', { receiverId: activeChat.userId });

    await dispatch(sendMessage({ receiverId: activeChat.userId, content: messageText })).unwrap();
    setMessageText('');
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !activeChat.userId) return;

    socket.emit('chat:typing', { receiverId: activeChat.userId });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('chat:stop-typing', { receiverId: activeChat.userId });
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const name = `${c.participant?.firstName} ${c.participant?.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const activePerson = conversations.find(
    (c) => (c.participant?._id || c.participant) === activeChat.userId
  )?.participant;

  const isOtherTyping = typingUsers[activeChat.userId];

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl overflow-hidden glass-card">
      {/* Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-navy-700 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Search header */}
        <div className="p-4 border-b border-navy-700">
          <h2 className="text-lg font-heading font-semibold text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-navy-800 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && conversations.length === 0 ? (
            <div className="p-4 space-y-3">
              <SkeletonCard /><SkeletonCard />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const person = conv.participant;
              const isActive = (person?._id || person) === activeChat.userId;

              return (
                <button
                  key={conv._id || person?._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-navy-800/50 ${
                    isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <Avatar
                    src={person?.profilePicture}
                    name={`${person?.firstName} ${person?.lastName}`}
                    size="md"
                    showOnline={person?.isOnline}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">
                        {person?.firstName} {person?.lastName}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {conv.lastMessage?.content || 'Start a conversation'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary rounded-full text-xs text-navy-900 font-semibold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat.userId ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-navy-700">
              <button onClick={() => setShowMobileChat(false)} className="md:hidden p-1">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </button>
              <Avatar
                src={activePerson?.profilePicture}
                name={`${activePerson?.firstName || ''} ${activePerson?.lastName || ''}`}
                size="md"
              />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  {activePerson?.firstName} {activePerson?.lastName}
                </p>
                {isOtherTyping ? (
                  <p className="text-primary text-xs">typing...</p>
                ) : (
                  <p className="text-gray-500 text-xs">{activePerson?.headline || ''}</p>
                )}
              </div>
              <button className="p-2 hover:bg-navy-700 rounded-lg">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeChat.messages.map((msg, i) => {
                const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                return (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-primary text-navy-900 rounded-br-md'
                        : 'bg-navy-800 text-gray-200 rounded-bl-md'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                        <span className={`text-[10px] ${isMe ? 'text-navy-600' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          msg.status === 'read' ? (
                            <CheckCheck className="h-3 w-3 text-navy-600" />
                          ) : (
                            <Check className="h-3 w-3 text-navy-600" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-navy-700">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-navy-700 rounded-lg transition-colors flex-shrink-0">
                  <Image className="h-5 w-5 text-gray-400" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => { setMessageText(e.target.value); handleTyping(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-navy-800 text-white text-sm rounded-xl px-4 py-3 pr-12 resize-none outline-none focus:ring-2 focus:ring-primary/30 placeholder-gray-500"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-navy-700 rounded-lg">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="p-3 bg-primary rounded-xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send className="h-5 w-5 text-navy-900" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-white mb-2">Your Messages</h3>
              <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
