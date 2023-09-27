import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileLandingScreen from '../screens/Profile/ProfileLandingScreen';
import ProfileHelpScreen from '../screens/Profile/ProfileHelpScreen';
import ContactUsScreen from '../screens/Profile/ContactUsScreen';
import ProfileSettingScreen from '../screens/Profile/ProfileSettingScreen';
import BlockSetting from '../screens/Profile/Settings/BlockSetting';
import NotificationSetting from '../screens/Profile/Settings/NotificationSetting';
import PurchaseVIPScreen from '../screens/Profile/PurchaseVIPScreen';
import ProfileDetailScreen from '~/screens/Profile/ProfileDetailScreen';
import EditProfileAboutMe from '~/screens/Profile/Edit/EditProfileAboutMe';
import EditSignatureScreen from '~/screens/Profile/Edit/EditSignatureScreen';
import CollectionScreen from '~/screens/Profile/CollectionScreen';
import EditProfilePhoto from '~/screens/Profile/Edit/EditProfilePhoto';
import FastLoginSettings from '~/screens/Profile/Settings/FastLoginSettings';
import ModifyPasswordSetting from '~/screens/Profile/Settings/ModifyPasswordSetting';
import AccountSettings from '~/screens/Profile/Settings/AccountSettings';
import ModifyPasswordFirstSetting from '~/screens/Profile/Settings/ModifyPasswordFirstSetting';
import ForgetPasswordScreen from '~/screens/Login/ForgetPasswordScreen';
import PurchaseHeart from '~/screens/Profile/PurchaseHeart';

export type ProfileStackParamList = {
  ProfileLandingScreen: undefined;
  ProfileHelpScreen: undefined;
  NotificationSetting: undefined;
  PurchaseVIPScreen: undefined;
  PurchaseHeart: undefined;
  CollectionScreen: undefined;
};

export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, Screen>;

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileLandingScreen"
      screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileLandingScreen" component={ProfileLandingScreen} />
      <ProfileStack.Screen name="PurchaseVIPScreen" component={PurchaseVIPScreen} />
      <ProfileStack.Screen name="PurchaseHeart" component={PurchaseHeart} />
      <ProfileStack.Screen name="ProfileHelpScreen" component={ProfileHelpScreen} />
      <ProfileStack.Screen name="CollectionScreen" component={CollectionScreen} />
     
    </ProfileStack.Navigator>
  );
}
