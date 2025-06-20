import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { hideNotification, clearNotification } from '@/stores/slices/notificationSlice';
import { Notification } from './notification';

const AUTO_CLOSE_DELAY = 5000;
const ANIMATION_DURATION = 300;

export const GlobalNotification = () => {
  const dispatch = useAppDispatch();
  const { message, type, isVisible, duration } = useAppSelector((state) => state.notification);

  useEffect(() => {
    if (isVisible) {
      const closeDelay = duration || AUTO_CLOSE_DELAY;

      const timer = setTimeout(() => {
        dispatch(hideNotification());

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
