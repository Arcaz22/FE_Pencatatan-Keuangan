import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { hideNotification, clearNotification } from '@/stores/slices/notificationSlice';
import { Notification } from './notification';

// Waktu dalam milidetik sebelum notifikasi tertutup otomatis
const AUTO_CLOSE_DELAY = 5000; // 5 detik
const ANIMATION_DURATION = 300; // 300ms

export const GlobalNotification = () => {
  const dispatch = useAppDispatch();
  const { message, type, isVisible, duration } = useAppSelector((state) => state.notification);

  useEffect(() => {
    if (isVisible) {
      // Gunakan duration dari state jika ada, atau gunakan default
      const closeDelay = duration || AUTO_CLOSE_DELAY;

      const timer = setTimeout(() => {
        dispatch(hideNotification());

        // Clear after animation completes
        setTimeout(() => {
          dispatch(clearNotification());
        }, ANIMATION_DURATION);
      }, closeDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Notification
        message={message}
        type={type}
        visible={isVisible}
        onClose={() => dispatch(hideNotification())}
      />
    </div>
  );
};
