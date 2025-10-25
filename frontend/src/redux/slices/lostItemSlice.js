import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lostItemsAPI } from '../../services/api';

// Async thunks
export const fetchLostItems = createAsyncThunk(
  'lostItems/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await lostItemsAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const fetchLostItem = createAsyncThunk(
  'lostItems/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lostItemsAPI.getOne(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch item');
    }
  }
);

export const createLostItem = createAsyncThunk(
  'lostItems/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await lostItemsAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create item');
    }
  }
);

export const updateLostItem = createAsyncThunk(
  'lostItems/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await lostItemsAPI.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteLostItem = createAsyncThunk(
  'lostItems/delete',
  async (id, { rejectWithValue }) => {
    try {
      await lostItemsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

export const claimLostItem = createAsyncThunk(
  'lostItems/claim',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lostItemsAPI.claim(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to claim item');
    }
  }
);

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

const lostItemSlice = createSlice({
  name: 'lostItems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addItemRealtime: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateItemRealtime: (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all items
      .addCase(fetchLostItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLostItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single item
      .addCase(fetchLostItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostItem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchLostItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create item
      .addCase(createLostItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update item
      .addCase(updateLostItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete item
      .addCase(deleteLostItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      // Claim item
      .addCase(claimLostItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError, addItemRealtime, updateItemRealtime } = lostItemSlice.actions;
export default lostItemSlice.reducer;
