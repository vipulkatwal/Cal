export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    // Check if we already have permission
    if (Notification.permission === 'granted') {
      return true;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const scheduleNotification = (title: string, eventTime: Date) => {
  try {
    if (Notification.permission !== 'granted') {
      requestNotificationPermission().then(granted => {
        if (granted) {
          scheduleEventNotifications(title, eventTime);
        }
      });
      return;
    }

    scheduleEventNotifications(title, eventTime);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

const scheduleEventNotifications = (title: string, eventTime: Date) => {
  const now = new Date();
  const timeUntilEvent = eventTime.getTime() - now.getTime();

  // Schedule notification 15 minutes before the event
  const notificationTime = timeUntilEvent - (15 * 60 * 1000);

  if (notificationTime > 0) {
    setTimeout(() => {
      showNotification(title, eventTime);
    }, notificationTime);
  }

  // Schedule notification at event time
  if (timeUntilEvent > 0) {
    setTimeout(() => {
      showNotification(title, eventTime, true);
    }, timeUntilEvent);
  }
};

export const showNotification = (title: string, eventTime: Date, isNow = false) => {
  try {
    if (Notification.permission === 'granted') {
      const timeStr = eventTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const notification = new Notification(
        isNow ? `🔔 Event Now: ${title}` : `⏰ Upcoming Event: ${title}`,
        {
          body: isNow
            ? `Your event "${title}" is starting now!`
            : `Your event "${title}" starts at ${timeStr} (in 15 minutes)`,
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSI0IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxsaW5lIHgxPSIxNiIgeTE9IjIiIHgyPSIxNiIgeTI9IjYiPjwvbGluZT48bGluZSB4MT0iOCIgeTE9IjIiIHgyPSI4IiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSIzIiB5MT0iMTAiIHgyPSIyMSIgeTI9IjEwIj48L2xpbmU+PC9zdmc+',
          badge: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSI0IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxsaW5lIHgxPSIxNiIgeTE9IjIiIHgyPSIxNiIgeTI9IjYiPjwvbGluZT48bGluZSB4MT0iOCIgeTE9IjIiIHgyPSI4IiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSIzIiB5MT0iMTAiIHgyPSIyMSIgeTI9IjEwIj48L2xpbmU+PC9zdmc+',
          requireInteraction: true,
          silent: false,
          vibrate: [200, 100, 200],
          tag: `event-${title}-${eventTime.getTime()}`,
          renotify: true
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close notification after 30 seconds
      setTimeout(() => notification.close(), 30000);

      // Schedule a reminder if the notification is ignored
      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          showNotification(title, eventTime, isNow);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};