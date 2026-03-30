import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (username, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${username}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/me', updates);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'users/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/suggestions');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async ({ query, location, cursor }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ q: query });
      if (location) params.append('location', location);
      if (cursor) params.append('cursor', cursor);

      const { data } = await api.get(`/users/search?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const initialState = {
  profileUser: null,
  suggestions: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearProfileUser: (state) => {
      state.profileUser = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileUser = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUser = action.payload.user;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload.data.users;
      });
  },
});

export const { clearProfileUser, clearSearchResults } = usersSlice.actions;
export default usersSlice.reducer;
