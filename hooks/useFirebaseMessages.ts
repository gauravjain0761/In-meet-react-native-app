import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-root-toast';
// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.

export default function useFirebaseMessages() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    const notificationAuthStatus = await messaging().hasPermission();
    if (notificationAuthStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      return token;
    }
    return '';
  }

  return { requestUserPermission };
}
