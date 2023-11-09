import { Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class Notifications {
  constructor() {
    this.navigation = null;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      onNotification:  (notification) => {
        const {channelId, data} = notification;
        
        if (data.notifyData && data.notifyData.type === 'chat') {
          this.navigation && this.navigation.navigate('MessageScreen',
            {user: JSON.parse(data.notifyData.user)},
          );
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
        // notification.finish('');
      },
      popInitialNotification: true,
      requestPermissions: true,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: false,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'chat', // (required)
        channelName: 'Chat notifications', // (required)
        channelDescription: 'Notification for chat',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications((rn) => {
      console.log('SN --- ', rn);
    });
  }

  schduleNotification(date) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: '🔔 Reminder!',
      message: 'You have set this reminder',
      date,
    });
  }

  localChatNotification(remoteMessage, navigation) {
    this.navigation = navigation;
    PushNotification.localNotification({
      channelId: 'chat',
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
      userInfo: {notifyData: remoteMessage.data},
    });
  }
}

export default new Notifications();
