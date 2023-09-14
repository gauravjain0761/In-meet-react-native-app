/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList;
  }
}

export type LoginStackParamList = {
  Login: undefined;
  Splash: undefined;
  PreLogin: undefined;
  ForgetPassword: undefined;
  PhoneLogin: undefined;
  RegisterPhone: undefined;
  RegisterPassword: undefined;
  RegisterVerifyCode: undefined;
  RegisterName: undefined;
  RegisterGender: undefined;
  RegisterBirth: undefined;
  RegisterAddress: undefined;
  RegisterInterest: undefined;
  RegisterImage: undefined;
  RegisterLocation: undefined;
  FastLoginEmailScreen: {
    email: string;
  };
  ForgetPasswordVerifyMail: {
    verifyCode: string;
    email: string;
  };
  ForgetPasswordTwo: {
    verifyCode: string;
    email: string;
  };
  FastLoginPassWordScreen: undefined;
  LocationPermission: undefined;
  LandingScreen?:undefined
};

export type RootStackParamList = {
  LoginRoot: NavigatorScreenParams<LoginStackParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  MatchingDetailScreen: undefined;
  ForumDetailScreen: undefined;
  AddPostScreen: undefined;
  AddPhotoScreen: undefined;
  RoomChatScreen: undefined;
  ImageBrowser: {
    backScreen: string;
    maxLength?: number;
  };
  ProfileDetail: undefined;
  ReportScreen: undefined;
  EditProfile: undefined;
  HelperRoomChatScreen: undefined;
  CollectionScreen: undefined;
  ImageGalleryScreen:undefined;
  PurchaseHeart:undefined
  PurchaseVIPScreen:undefined
  EditSignatureScreen:undefined
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  LandingTab: undefined;
  SearchInterest: undefined;
  Forums: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type PreLoginScreenProps = NativeStackScreenProps<LoginStackParamList, 'PreLogin'>;
export type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, 'Login'>;
export type PhoneLoginScreenProps = NativeStackScreenProps<LoginStackParamList, 'PhoneLogin'>;

export type ForgetPasswordScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'ForgetPassword'
>;
export type LocationPermissionScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'LocationPermission'
>;
export type RegisterPhoneScreenProps = NativeStackScreenProps<LoginStackParamList, 'RegisterPhone'>;
export type ForgetPasswordVerifyMailScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'ForgetPasswordVerifyMail'
>;
export type ForgetPasswordTwoScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'ForgetPasswordTwo'
>;
export type RegisterPasswordScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterPassword'
>;
export type RegisterVerifyCodeProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterVerifyCode'
>;
export type RegisterNameScreenProps = NativeStackScreenProps<LoginStackParamList, 'RegisterName'>;
export type RegisterGenderScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterGender'
>;
export type RegisterBirthScreenProps = NativeStackScreenProps<LoginStackParamList, 'RegisterBirth'>;
export type RegisterAddressScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterAddress'
>;
export type RegisterInterestScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterInterest'
>;

export type RegisterImageScreenProps = NativeStackScreenProps<LoginStackParamList, 'RegisterImage'>;

export type RegisterLocationScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterLocation'
>;
export type FastLoginEmailScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'FastLoginEmailScreen'
>;
export type FastLoginPassWordScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'FastLoginPassWordScreen'
>;

export type SplashScreenProps = NativeStackScreenProps<LoginStackParamList, 'Splash'>;
