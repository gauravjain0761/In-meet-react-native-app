import 'expo-dev-client';

import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import { AsyncStorage } from 'react-native';
import App from './App';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const currentMessages = await AsyncStorage.getItem('messages');
  const messageArray = JSON.parse(currentMessages);
  messageArray.push(remoteMessage.data);
  await AsyncStorage.setItem('messages', JSON.stringify(messageArray));
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
