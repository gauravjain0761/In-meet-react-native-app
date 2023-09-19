import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import ConstellationSearchScreen from '../screens/Landing/ConstellationSearchScreen';
import ConstellationResultScreen from '../screens/Landing/ConstellationResultScreen';
import FilterScreen from '../screens/Landing/FilterScreen';
import DicoverScreen from '~/screens/Landing/DicoverScreen';

export type LandingStackParamList = {
  Landing: undefined;
  ConstellationSearchScreen: undefined;
  ConstellationResultScreen: {
    constellation: string;
  };
  FilterSearchScreen: undefined;
  MatchingDetailScreen: undefined;
  DicoverScreen: undefined;
};

export type LandingScreenProps = NativeStackScreenProps<LandingStackParamList, 'Landing'>;
export type DicoverScreenProps = NativeStackScreenProps<LandingStackParamList, 'DicoverScreen'>;
export type MatchingDetailScreenProps = NativeStackScreenProps<
  LandingStackParamList,
  'MatchingDetailScreen'
>;

export type FilterScreenProps = NativeStackScreenProps<LandingStackParamList, 'FilterSearchScreen'>;
export type ConstellationSearchScreenProps = NativeStackScreenProps<
  LandingStackParamList,
  'ConstellationSearchScreen'
>;
export type ConstellationResultScreenProps = NativeStackScreenProps<
  LandingStackParamList,
  'ConstellationResultScreen'
>;

const LandingStack = createNativeStackNavigator<LandingStackParamList>();

export default function LandingNavigator() {
  return (
    <LandingStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <LandingStack.Screen name="Landing" component={LandingScreen} />
      <LandingStack.Screen name="FilterSearchScreen" component={FilterScreen} />
      <LandingStack.Screen name="DicoverScreen" component={DicoverScreen} />
      <LandingStack.Screen name="ConstellationSearchScreen" component={ConstellationSearchScreen} />
      <LandingStack.Screen name="ConstellationResultScreen" component={ConstellationResultScreen} />
    </LandingStack.Navigator>
  );
}
