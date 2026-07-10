import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage, setLoggingStatus, setFormFields } from '../store';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatAssistant = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.crm.chatMessages);
  const isLogging = useSelector(state => state.crm.isLogging);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    dispatch(addChatMessage({ sender: 'user', text: userMessage }));
    dispatch(setLoggingStatus(true));

    try {
      const response = await axios.post('http://localhost:8000/api/chat', { 
          message: userMessage,
          history: messages 
      });
      let replyText = response.data.response;
      
      if (replyText.includes('LOGGED_INTERACTION')) {
          replyText = replyText.replace('LOGGED_INTERACTION', '').trim();
          try {
             const latestRes = await axios.get('http://localhost:8000/api/interactions/latest');
             if(latestRes.data) {
                 dispatch(setFormFields({
                    hcp_name: latestRes.data.hcp_name || '',
                    topics_discussed: latestRes.data.topics_discussed || '',
                    sentiment: latestRes.data.sentiment || 'Neutral',
                    outcomes: latestRes.data.outcomes || '',
                    follow_up_actions: latestRes.data.follow_up_actions || '',
                    interaction_date: latestRes.data.interaction_date || new Date().toISOString().split('T')[0]
                 }));
             }
          } catch(err) {
              console.error("Failed to fetch latest interaction", err);
          }
      }

      dispatch(addChatMessage({ sender: 'ai', text: replyText }));
    } catch (error) {
      console.error(error);
      dispatch(addChatMessage({ sender: 'ai', text: 'Sorry, I encountered an error. Is the backend running and GROQ_API_KEY set?' }));
    } finally {
      dispatch(setLoggingStatus(false));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm leading-relaxed overflow-x-auto ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => <table className="min-w-full divide-y divide-gray-200 my-2 border border-gray-200 rounded" {...props} />,
                  th: ({node, ...props}) => <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${msg.sender === 'user' ? 'text-white' : 'text-gray-500 bg-gray-50'}`} {...props} />,
                  td: ({node, ...props}) => <td className="px-3 py-2 text-sm border-t border-gray-100" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLogging && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-xl text-sm shadow-sm bg-white border border-gray-200 text-gray-800 rounded-bl-sm">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe interaction..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={isLogging}
          className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
             <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
          Log
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
