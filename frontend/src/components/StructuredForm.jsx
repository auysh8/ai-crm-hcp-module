import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, resetForm } from '../store';

const StructuredForm = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.crm.interactionForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        alert("Interaction saved successfully!");
        dispatch(resetForm());
      } else {
        alert("Failed to save interaction. Please check the backend connection.");
      }
    } catch (error) {
      console.error("Error saving interaction:", error);
      alert("Error saving interaction. Please ensure the backend is running.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HCP Name</label>
          <input 
            type="text" 
            name="hcp_name"
            value={form.hcp_name}
            onChange={handleChange}
            placeholder="Search or select HCP..." 
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interaction Type</label>
          <select 
            name="interaction_type"
            value={form.interaction_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option>Meeting</option>
            <option>Email</option>
            <option>Call</option>
            <option>Event</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            name="interaction_date"
            value={form.interaction_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input 
            type="time" 
            name="interaction_time"
            value={form.interaction_time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
        <input 
          type="text" 
          name="attendees"
          value={form.attendees}
          onChange={handleChange}
          placeholder="Enter names or search..." 
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Topics Discussed</label>
        <textarea 
          name="topics_discussed"
          value={form.topics_discussed}
          onChange={handleChange}
          placeholder="Enter key discussion points..." 
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Observed/Inferred HCP Sentiment</label>
        <div className="flex gap-6">
          {(() => {
            const getNormalizedSentiment = (s) => {
              if(!s) return '';
              const low = s.toLowerCase();
              if(low.includes('positive')) return 'Positive';
              if(low.includes('negative')) return 'Negative';
              if(low.includes('neutral')) return 'Neutral';
              return s;
            };
            const currentSentiment = getNormalizedSentiment(form.sentiment);
            return (
              <>
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="sentiment" value="Positive" checked={currentSentiment === 'Positive'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="text-gray-700">😊 Positive</span>
                </label>
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="sentiment" value="Neutral" checked={currentSentiment === 'Neutral'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="text-gray-700">😐 Neutral</span>
                </label>
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="sentiment" value="Negative" checked={currentSentiment === 'Negative'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="text-gray-700">😠 Negative</span>
                </label>
              </>
            );
          })()}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes</label>
        <textarea 
          name="outcomes"
          value={form.outcomes}
          onChange={handleChange}
          placeholder="Key outcomes or agreements..." 
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Actions</label>
        <textarea 
          name="follow_up_actions"
          value={form.follow_up_actions}
          onChange={handleChange}
          placeholder="Enter next steps or tasks..." 
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
        ></textarea>
      </div>
      
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors font-medium"
        >
          Save Interaction
        </button>
      </div>
    </div>
  );
};

export default StructuredForm;
