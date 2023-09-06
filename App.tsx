import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, Button, createTheme } from '@rneui/themed';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import { TextEncoder, TextDecoder, EncodingIndexes, getEncoding } from 'text-decoding';
import { initializeApp } from 'firebase/app';
import { RootSiblingParent } from 'react-native-root-siblings';
import messaging from '@react-native-firebase/messaging';
import { connectToDevTools } from 'react-devtools-core';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-root-toast';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import firebaseConfig from '~/firebaseSetting';
import { store } from './store';
import Navigation from './navigation';
import useColorScheme from './hooks/useColorScheme';
import useCachedResources from './hooks/useCachedResources';
import initFireBase from './firebaseSetting';
import useInitFirebaseMessages from './hooks/useInitFirebaseMessages';

if (__DEV__) {
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
}
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;

const queryClient = new QueryClient();

const theme = createTheme({
  Button: {
    titleStyle: {
      color: 'red',
    },
  },
  lightColors: {
    black1: '#383A44',
    black2: '#4A4D5A',
    black3: '#6F7387',
    black4: '#A8ABBD',
    black5: '#EFEFEF',
    pink: '#FF4E84',
    pink1: '#F19BB5',
    white: '#FFFFFF',
    green: '#0ACF83',
    purple: '#E134EE',
    yellow: '#FFD809',
    grey2: '#6F7387',
    grey3: '#5D6071',
    grey4: '#4A4D5A',
    grey5: '#383A44',
    grey6: '#7C7C7C',
    linearGradient: 'linear-gradient(180deg, #F78CFF 0%, #FFADE8 42.71%, #FF4E84 100%)',
  },
  darkColors: {
    black1: '#383A44',
    black2: '#4A4D5A',
    black3: '#6F7387',
    black4: '#A8ABBD',
    black5: '#EFEFEF',
    pink: '#FF4E84',
    pink1: '#F19BB5',
    white: '#FFFFFF',
    green: '#0ACF83',
    purple: '#E134EE',
    yellow: '#FFD809',
    grey2: '#6F7387',
    grey3: '#5D6071',
    grey4: '#4A4D5A',
    grey5: '#383A44',
    linearGradient: 'linear-gradient(180deg, #F78CFF 0%, #FFADE8 42.71%, #FF4E84 100%)',
    grey6: '#7C7C7C',
  },
  mode: 'light',
});

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

initializeApp(firebaseConfig);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  useInitFirebaseMessages();
  useEffect(() => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      if (remoteMessage.data?.url) {
        await Linking.openURL(remoteMessage.data?.url);
      }
      // navigation.navigate(remoteMessage.data.type);
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          if (remoteMessage.data?.url) {
            await Linking.openURL(remoteMessage.data?.url);
          }
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
  }, []);
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <PaperProvider>
              <ActionSheetProvider>
                <QueryClientProvider client={queryClient}>
                  <Navigation colorScheme={colorScheme} />
                </QueryClientProvider>
              </ActionSheetProvider>
              <StatusBar style="light" />
            </PaperProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </RootSiblingParent>
  );
}
