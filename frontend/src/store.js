import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  interactionForm: {
    hcp_name: '',
    interaction_type: 'Meeting',
    interaction_date: new Date().toISOString().split('T')[0],
    interaction_time: '',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: ''
  },
  chatMessages: [
    { sender: 'ai', text: 'Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.' }
  ],
  isLogging: false
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.interactionForm[field] = value;
    },
    setFormFields: (state, action) => {
      state.interactionForm = { ...state.interactionForm, ...action.payload };
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setLoggingStatus: (state, action) => {
      state.isLogging = action.payload;
    },
    resetForm: (state) => {
      state.interactionForm = initialState.interactionForm;
    }
  }
});

export const { updateFormField, setFormFields, addChatMessage, setLoggingStatus, resetForm } = crmSlice.actions;

export const store = configureStore({
  reducer: {
    crm: crmSlice.reducer
  }
});
