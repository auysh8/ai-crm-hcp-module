import React from 'react';
import StructuredForm from './components/StructuredForm';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-gray-50 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Log HCP Interaction</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Structured Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">Interaction Details</h2>
          <StructuredForm />
        </div>

        {/* Right Side: AI Assistant */}
        <div className="w-full lg:w-1/3 bg-white flex flex-col rounded-lg shadow-sm border border-gray-200 h-[800px]">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">AI Assistant</h2>
              <p className="text-xs text-gray-500">Log interaction via chat</p>
            </div>
          </div>
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
}

export default App;
