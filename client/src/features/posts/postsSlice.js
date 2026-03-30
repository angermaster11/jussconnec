import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async ({ cursor, filter } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      if (filter) params.append('filter', filter);
      params.append('limit', '20');

      const { data } = await api.get(`/posts/feed?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const reactToPost = createAsyncThunk(
  'posts/react',
  async ({ postId, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/posts/${postId}/react`, { type });
      return { postId, reactionsCount: data.data.reactionsCount };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to react');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const savePost = createAsyncThunk(
  'posts/save',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/posts/${postId}/save`);
      return { postId, saved: data.data.saved };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save post');
    }
  }
);

const initialState = {
  feed: [],
  currentPost: null,
  isLoading: false,
  isCreating: false,
  error: null,
  pagination: {
    cursor: null,
    hasMore: true,
  },
  filter: 'all',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.feed = [];
      state.pagination = { cursor: null, hasMore: true };
    },
    clearFeed: (state) => {
      state.feed = [];
      state.pagination = { cursor: null, hasMore: true };
    },
    updatePostReactions: (state, action) => {
      const { postId, reactionsCount } = action.payload;
      const post = state.feed.find((p) => p._id === postId);
      if (post) post.reactionsCount = reactionsCount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const newPosts = action.payload.data.posts;
        // Append for infinite scroll (avoid duplicates)
        const existingIds = new Set(state.feed.map((p) => p._id));
        const uniqueNew = newPosts.filter((p) => !existingIds.has(p._id));
        state.feed = [...state.feed, ...uniqueNew];
        state.pagination = {
          cursor: action.payload.pagination?.cursor,
          hasMore: action.payload.pagination?.hasMore ?? false,
        };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.feed = [action.payload.post, ...state.feed];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        const { postId, reactionsCount } = action.payload;
        const post = state.feed.find((p) => p._id === postId);
        if (post) post.reactionsCount = reactionsCount;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.feed = state.feed.filter((p) => p._id !== action.payload);
      })
      .addCase(savePost.fulfilled, (state, action) => {
        const { postId, saved } = action.payload;
        const post = state.feed.find((p) => p._id === postId);
        if (post) post.isSaved = saved;
      });
  },
});

export const { setFilter, clearFeed, updatePostReactions } = postsSlice.actions;
export default postsSlice.reducer;
