import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: {},
    messages: [],
  },
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChat, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
