import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Save token to phone storage
      AsyncStorage.setItem('userToken', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Remove token from phone storage
      AsyncStorage.removeItem('userToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;