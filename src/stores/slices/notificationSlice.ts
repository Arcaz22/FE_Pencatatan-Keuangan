import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationState {
  message: string | null;
  type: NotificationType;
  isVisible: boolean;
  duration?: number;
}

const initialState: NotificationState = {
  message: null,
  type: 'info',
  isVisible: false,
  duration: 3000
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: NotificationType; duration?: number }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isVisible = true;
      if (action.payload.duration !== undefined) {
        state.duration = action.payload.duration;
      }
    },
    hideNotification: (state) => {
      state.isVisible = false;
    },
    clearNotification: (state) => {
      state.message = null;
      state.isVisible = false;
      state.duration = initialState.duration;
    }
  }
});

export const { showNotification, hideNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
