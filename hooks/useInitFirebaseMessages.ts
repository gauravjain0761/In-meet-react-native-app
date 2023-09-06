import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.

export default function useInitFirebaseMessages() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);
  return [];
}
