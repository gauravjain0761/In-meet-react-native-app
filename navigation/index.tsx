/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import * as React from 'react';
import {
  ColorSchemeName,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { patchUserToken, selectLoginState } from '~/store/userSlice';

import Colors from '../constants/Colors';
import { mapIcon } from '../constants/IconsMapping';
import useColorScheme from '../hooks/useColorScheme';
import ChatScreen from '../screens/ChatScreen';
import AddPostScreen from '../screens/Forum/AddPostScreen';
import ForumDetailScreen from '../screens/Forum/ForumDetailScreen';
import ReportScreen from '../screens/Report/ReportScreen';
import ForumsScreen from '../screens/ForumsScreen';
import ImageBrowserScreen from '../screens/ImageBrowserScreen';
import MatchingDetailScreen from '../screens/Landing/MatchingDetailScreen';
import LandingScreen from '../screens/LandingScreen';
import ForgetPasswordScreen from '../screens/Login/ForgetPasswordScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import PreLoginScreen from '../screens/Login/PreLoginScreen';
import RegisterAddressScreen from '../screens/Login/RegisterAddressScreen';
import RegisterBirthScreen from '../screens/Login/RegisterBirthScreen';
import RegisterPhoneScreen from '../screens/Login/RegisterPhoneScreen';
import RegisterGenderScreen from '../screens/Login/RegisterGenderScreen';
import RegisterImageScreen from '../screens/Login/RegisterImageScreen';
import RegisterInterestScreen from '../screens/Login/RegisterInterestScreen';
import RegisterLocationScreen from '../screens/Login/RegisterLocationScreen';
import RegisterNameScreen from '../screens/Login/RegisterNameScreen';
import RegisterPasswordScreen from '../screens/Login/RegisterPasswordScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import ProfileDetailScreen from '../screens/Profile/ProfileDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomChatScreen from '../screens/RoomChatScreen';
import SearchInterestScreen from '../screens/SearchInterestScreen';
import SplashScreen from '../screens/SplashScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import {
  LoginStackParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types';
import InterestNavigator from './InterestNavigator';
import LandingNavigator from './LandingNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import ProfileNavigator from './ProfileNavigator';
import { AuthProvider } from '~/hooks/useAuth';
import EditProfileNavigator from './EditProfileNavigator';
import { getPushToken, hasNotificationPermission, requestNotificationPerm } from '~/notifications';
import FastLoginEmailScreen from '~/screens/Login/FastLoginEmailScreen';
import FastLoginPassWordScreen from '~/screens/Login/FastLoginPassWordScreen';
import ImageGalleryScreen from '~/screens/ImageGalleryScreen';
import { useAppDispatch } from '~/store';
import HelperRoomChatScreen from '~/screens/HelperRoomChatScreen';
import EditSignatureScreen from '~/screens/Profile/Edit/EditSignatureScreen';
import PurchaseHeart from '~/screens/Profile/PurchaseHeart';
import PurchaseVIPScreen from '~/screens/Profile/PurchaseVIPScreen';
import ForgetPasswordVerifyMailScreen from '~/screens/Login/ForgetPasswordVerifyMailScreen';
import ForgetPasswordTwoScreen from '~/screens/Login/ForgetPasswordTwoScreen';
import AddPhotoScreen from '~/screens/Profile/AddPhotoScreen';
import LocationPermissionScreen from '~/screens/LocationPermissionScreen';
import PhoneLoginScreen from '~/screens/Login/PhoneLoginScreen';
import RegisterVerifyCodeScreen from '~/screens/Login/RegisterVerifyCodeScreen';
import ChatScreenList from '~/screens/ChatScreenList';
import VIPPurchaseScreen from '~/screens/Profile/VIPPurchaseScreen';
import ProfileImageScreen from '~/screens/Profile/ProfileImageScreen';
import EditProfilePhoto from '~/screens/Profile/Edit/EditProfilePhoto';
import FilterScreen from '~/screens/Landing/FilterScreen';
import MyUpdateScreen from '~/screens/Landing/MyUpdateScreen';
import ProfileSettingScreen from '~/screens/Profile/ProfileSettingScreen';
import NotificationSetting from '~/screens/Profile/Settings/NotificationSetting';
import BlockSetting from '~/screens/Profile/Settings/BlockSetting';
import AccountSettings from '~/screens/Profile/Settings/AccountSettings';
import ModifyPasswordSetting from '~/screens/Profile/Settings/ModifyPasswordSetting';
import FastLoginSettings from '~/screens/Profile/Settings/FastLoginSettings';
import ModifyPasswordFirstSetting from '~/screens/Profile/Settings/ModifyPasswordFirstSetting';
import ContactUsScreen from '~/screens/Profile/ContactUsScreen';
import ImageBrowserScreenNew from '../screens/ImageBrowserScreenNew';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

function LoginNavigator() {
  return (
    <LoginStack.Navigator initialRouteName="PreLogin" screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="PreLogin" component={PreLoginScreen} />
      <LoginStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false,}} />
      <LoginStack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ headerShown: false,}}  />
      <LoginStack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false,}} />
      <LoginStack.Screen name="Splash" component={SplashScreen} />
      <LoginStack.Screen name="RegisterPhone" component={RegisterPhoneScreen}  options={{ headerShown: false,}}/>
      <LoginStack.Screen name="RegisterPassword" component={RegisterPasswordScreen} />
      <LoginStack.Screen name="RegisterVerifyCode" component={RegisterVerifyCodeScreen}  />
      <LoginStack.Screen name="RegisterName" component={RegisterNameScreen} />
      <LoginStack.Screen name="RegisterGender" component={RegisterGenderScreen} />
      <LoginStack.Screen name="RegisterBirth" component={RegisterBirthScreen} />
      <LoginStack.Screen name="RegisterAddress" component={RegisterAddressScreen} />
      <LoginStack.Screen name="RegisterInterest" component={RegisterInterestScreen} />
      <LoginStack.Screen name="RegisterImage" component={RegisterImageScreen} />
      <LoginStack.Screen name="RegisterLocation" component={RegisterLocationScreen} />
      <LoginStack.Screen name="FastLoginEmailScreen" component={FastLoginEmailScreen} />
      <LoginStack.Screen name="FastLoginPassWordScreen" component={FastLoginPassWordScreen} />
      <LoginStack.Screen
        name="ForgetPasswordVerifyMail"
        component={ForgetPasswordVerifyMailScreen}
      />
      <LoginStack.Screen name="ForgetPasswordTwo" component={ForgetPasswordTwoScreen} />
      <LoginStack.Screen name="LocationPermission" component={LocationPermissionScreen} />
    </LoginStack.Navigator>
  );
}
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const handleTapOnNotification = async (res: Notifications.NotificationResponse) => {
    const data = res?.notification?.request?.content?.data;
    const badge = res?.notification?.request?.content?.badge || 0;
    await Notifications.setBadgeCountAsync(badge);
    // if (!data || !user) return;
    // const userData = (
    //   await firestore().collection('users').doc(user.uid).get()
    // ).data();
    // if (!user.emailVerified) {
    //   navigation.navigate('ChatsList');
    // }
    // if (userData?.gender === 'female' || userData?.isPremium) {
    //   if (data?.recipientName && data?.recipientId && data?.userId) {
    //     navigation.reset({
    //       index: 1,
    //       routes: [
    //         {
    //           name: 'ChatsList',
    //         },
    //         {
    //           name: 'Chat',
    //           params: {
    //             recipientName: data.recipientName,
    //             userId: data.userId,
    //             herUid: data?.recipientId,
    //           },
    //         },
    //       ],
    //     });
    //   }
    // }
  };
  // React.useEffect(() => {
  //   const notification = async () => {
  //     try {
  //       const hasPermission = await hasNotificationPermission();
  //       if (!hasPermission) {
  //         await requestNotificationPerm();
  //       }
  //       const token = await getPushToken();
  //       console.log('expo push token: ', token);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     console.log('notification: ', notification);
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener(handleTapOnNotification);

  //   notification();

  //   return () => {
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //   };
  // }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="LandingTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.black1,
          borderTopColor: theme.colors.black1,
        },
        tabBarInactiveBackgroundColor: theme.colors?.black1,
        tabBarActiveTintColor: theme.colors.white,
        tabBarActiveBackgroundColor: theme.colors.black1,
      }}>
      {/* <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      /> */}
      <BottomTab.Screen
        name="LandingTab"
        component={LandingNavigator}
        options={{
          title: 'MEET',
          tabBarIcon: ({ color }) => mapIcon.forumsMeet({ color }),
        }}
      />
      <BottomTab.Screen
        name="SearchInterest"
        component={InterestNavigator}
        options={{
          title: 'LIKE',
          tabBarIcon: ({ color }) => <Ionicons name="md-heart" size={26} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Forums"
        component={ForumsScreen}
        options={{
          title: '動態',
          tabBarIcon: ({ color }) => mapIcon.forums({ color }),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: '聊天',
          tabBarIcon: ({ color }) => mapIcon.chatIcon({ color }),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: '個人',
          tabBarIcon: ({ color }) => mapIcon.profileIcon({ color }),
        }}
      />
    </BottomTab.Navigator>
  );
}

function RootNavigator() {
  const isLoggedIn = useSelector(selectLoginState);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Group>
            <Stack.Screen
              name="Root"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />

            {/* LandingDash */}
            <Stack.Screen
              options={{
                headerTransparent: true,
                headerShown:false
              }}
              name="MatchingDetailScreen"
              component={MatchingDetailScreen}
            />

            {/* Profile */}
            <Stack.Screen
              options={{ headerShown: false }}
              name="ProfileDetail"
              component={ProfileDetailScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="EditProfile"
              component={EditProfileNavigator}
            />
            <Stack.Screen options={{headerShown:false}} name="ForumDetailScreen" component={ForumDetailScreen} />
            <Stack.Screen options={{}} name="AddPostScreen" component={AddPostScreen} />
            <Stack.Screen options={{}} name="AddPhotoScreen" component={AddPhotoScreen} />
            <Stack.Screen options={{headerShown:false}} name="RoomChatScreen" component={RoomChatScreen} />
            <Stack.Screen
              options={{headerShown:false}}
              name="HelperRoomChatScreen"
              component={HelperRoomChatScreen}
            />
            <Stack.Screen options={{}} name="ReportScreen" component={ReportScreen} />
            <Stack.Screen options={{}} name="ChatScreenList" component={ChatScreenList} />
            <Stack.Screen options={{}} name="VIPPurchaseScreen" component={VIPPurchaseScreen} />
            <Stack.Screen options={{}} name="ProfileImageScreen" component={ProfileImageScreen} />
            <Stack.Screen options={{}} name="ImageGalleryScreen" component={ImageGalleryScreen} />
            <Stack.Screen options={{}} name="PurchaseHeart" component={PurchaseHeart} />
            <Stack.Screen options={{}} name="PurchaseVIPScreen" component={PurchaseVIPScreen} />
            <Stack.Screen options={{}} name="EditSignatureScreen" component={EditSignatureScreen} />
           <Stack.Screen name="EditProfilePhoto" component={EditProfilePhoto} />
      <Stack.Screen name="FilterSearchScreen" component={FilterScreen} />
      <Stack.Screen name="MyUpdateScreen" component={MyUpdateScreen} />
      <Stack.Screen name="ProfileSettingScreen" component={ProfileSettingScreen} />
      <Stack.Screen name="NotificationSetting" component={NotificationSetting} />
      <Stack.Screen name="BlockSetting" component={BlockSetting} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="ModifyPasswordSetting" component={ModifyPasswordSetting} />
      <Stack.Screen name="FastLoginSettings" component={FastLoginSettings} />
      {/* <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} /> */}
      <Stack.Screen
        name="ModifyPasswordFirstSetting"
        component={ModifyPasswordFirstSetting}
      />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />

          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
            <Stack.Screen name="ImageBrowser" component={ImageBrowserScreen} />
            <Stack.Screen name="ImageBrowserNew" component={ImageBrowserScreenNew} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="LoginRoot"
          component={LoginNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
