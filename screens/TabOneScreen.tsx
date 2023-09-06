import { StyleSheet, Platform, Text as DefaultText, Linking, AsyncStorage } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme, makeStyles, Icon } from '@rneui/themed';
import styledRN from 'styled-components/native';
import styled from 'styled-components';
import { Button, ButtonProps } from '@rneui/base';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { RootTabScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import EditScreenInfo from '../components/EditScreenInfo';
import { BodyTwo, SubTitleOne } from '../components/common/Text';
import useFirebaseMessages from '~/hooks/useFirebaseMessages';
import BannerModal from '~/components/common/BannerModal';
import { userApi } from '~/api/UserAPI';
import { useAppDispatch } from '~/store';
import { patchUserNotification } from '~/store/userSlice';

const useStyles = makeStyles(theme => ({
  testWidth: {
    width: '100%',
  },
  type1Text: {
    color: theme.colors?.green,
  },
  type1Button: {
    backgroundColor: theme.colors?.purple,
  },
  type2Button: {
    backgroundColor: theme.colors?.pink,
  },
  chosenButton: {
    backgroundColor: theme.colors?.white,
    borderWidth: 2,
    borderColor: theme.colors?.pink,
    borderRadius: 30,
  },
  chosenTitle: {
    color: theme.colors?.pink,
  },
  unChosenButton: {
    backgroundColor: theme.colors?.white,
    borderWidth: 1,
    borderColor: theme.colors?.pink,
    borderRadius: 30,
  },
  unChosenTitle: {
    color: theme.colors?.black4,
  },
  typeFiveChosenButton: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: theme.colors?.black5,
  },
  dollarsText: {
    color: theme.colors?.pink,
  },
  typeFourUnChosenMonthText: {
    color: theme.colors?.black4,
  },
  typeFourUnChosen: {
    borderRadius: 15,
    borderColor: theme.colors?.black5,
    padding: 0,
    paddingVertical: 15,
    backgroundColor: theme.colors?.black5,
  },
  typeFourUnChosenDollarsText: {
    color: theme.colors?.black3,
  },
}));

function ButtonTypeFiveChosen(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);

  function CustomView() {
    return (
      <View style={styles.typeFiveChosenButton}>
        <BodyTwo style={styles.typeFourUnChosenMonthText}>12個月</BodyTwo>
        <SubTitleOne style={styles.typeFourUnChosenDollarsText}>NT$2500</SubTitleOne>
      </View>
    );
  }
  return (
    <Button
      {...props}
      type="outline"
      title={<CustomView />}
      buttonStyle={[styles.typeFourUnChosen, buttonStyle]}
    />
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const data: { url?: string } = response.notification.request.content;

  if (data?.url) Linking.openURL(data.url);
};

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const { theme } = useTheme();
  const classes = useStyles();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const { requestUserPermission } = useFirebaseMessages();
  const getMessage = async () => {
    Linking.openURL('com.inmeet.inmeet://feed/10');
  };
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <ButtonTypeFiveChosen
        containerStyle={classes.testWidth}
        onPress={() => {
          setIsVisible(true);
        }}
        title="My Button"
      />

      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
