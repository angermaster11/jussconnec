import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ cursor } = {}, { rejectWithValue }) => {
    try {
      const params = cursor ? `?cursor=${cursor}` : '';
      const { data } = await api.get(`/notifications${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.put('/notifications/read-all');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${id}/read`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  pagination: { cursor: null, hasMore: true },
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items = [action.payload, ...state.items];
      state.unreadCount += 1;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItems = action.payload.data.notifications;
        const existingIds = new Set(state.items.map((n) => n._id));
        const unique = newItems.filter((n) => !existingIds.has(n._id));
        state.items = [...state.items, ...unique];
        state.unreadCount = action.payload.data.unreadCount;
        state.pagination = {
          cursor: action.payload.pagination?.cursor,
          hasMore: action.payload.pagination?.hasMore ?? false,
        };
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find((n) => n._id === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addNotification, setUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
