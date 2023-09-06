import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';
import { ExpoPushToken, NotificationPermissionsStatus } from 'expo-notifications';
import { Platform } from 'react-native';

export const hasNotificationPermission = async (): Promise<boolean> => {
  if (!isDevice) {
    alert('Must use physical device for Push Notifications');
    return false;
  }
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

export const requestNotificationPerm = async (): Promise<NotificationPermissionsStatus> => {
  const res = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
  return res;
};

export const getPushToken = async (): Promise<ExpoPushToken> => {
  // should pass the experienceId on the bareworkflow
  const token = await Notifications.getExpoPushTokenAsync({
    experienceId: '@seanhsieh/INNext-react-native',
  });
  return token;
};
