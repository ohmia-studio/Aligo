import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export default rootReducer;
