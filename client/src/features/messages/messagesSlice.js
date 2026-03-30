import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/messages/conversations');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ userId, cursor }, { rejectWithValue }) => {
    try {
      const params = cursor ? `?cursor=${cursor}` : '';
      const { data } = await api.get(`/messages/${userId}${params}`);
      return { ...data, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ userId, content, messageType }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/messages/${userId}`, { content, messageType });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send');
    }
  }
);

const initialState = {
  conversations: [],
  activeChat: {
    userId: null,
    messages: [],
    isLoading: false,
    pagination: { cursor: null, hasMore: true },
  },
  isLoading: false,
  typingUsers: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat.userId = action.payload;
      state.activeChat.messages = [];
      state.activeChat.pagination = { cursor: null, hasMore: true };
    },
    addMessage: (state, action) => {
      state.activeChat.messages.push(action.payload);
      // Update conversation last message
      const conv = state.conversations.find(
        (c) => c.otherUser?._id === action.payload.sender?._id ||
               c.otherUser?._id === action.payload.receiver
      );
      if (conv) {
        conv.lastMessage = {
          content: action.payload.content,
          createdAt: action.payload.createdAt,
          sender: action.payload.sender?._id || action.payload.sender,
        };
      }
    },
    setTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[conversationId] = userId;
      } else {
        delete state.typingUsers[conversationId];
      }
    },
    markMessagesRead: (state, action) => {
      const { conversationId } = action.payload;
      const conv = state.conversations.find((c) => c.conversationId === conversationId);
      if (conv) conv.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.activeChat.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.activeChat.isLoading = false;
        const newMsgs = action.payload.data.messages;
        const existingIds = new Set(state.activeChat.messages.map((m) => m._id));
        const unique = newMsgs.filter((m) => !existingIds.has(m._id));
        state.activeChat.messages = [...unique, ...state.activeChat.messages];
        state.activeChat.pagination = {
          cursor: action.payload.pagination?.cursor,
          hasMore: action.payload.pagination?.hasMore ?? false,
        };
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.activeChat.isLoading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeChat.messages.push(action.payload.message);
      });
  },
});

export const { setActiveChat, addMessage, setTyping, markMessagesRead } = messagesSlice.actions;
export default messagesSlice.reducer;
