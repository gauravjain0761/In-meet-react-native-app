import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import ConstellationSearchScreen from '../screens/Landing/ConstellationSearchScreen';
import ConstellationResultScreen from '../screens/Landing/ConstellationResultScreen';
import FilterScreen from '../screens/Landing/FilterScreen';
import SearchInterestResultScreen from '../screens/Interest/SearchInterestResultScreen';
import SearchInterestScreen from '../screens/SearchInterestScreen';

export type InterestStackParamList = {
  SearchInterestList: undefined;
  SearchInterestResult: {
    interest: string;
    count: number;
    id: number;
  };
};
export type SearchInterestListProps = NativeStackScreenProps<
  InterestStackParamList,
  'SearchInterestList'
>;
export type SearchInterestResultScreenProps = NativeStackScreenProps<
  InterestStackParamList,
  'SearchInterestResult'
>;

const InterestStack = createNativeStackNavigator<InterestStackParamList>();

export default function InterestNavigator() {
  return (
    <InterestStack.Navigator
      initialRouteName="SearchInterestList"
      screenOptions={{ headerShown: false }}>
      <InterestStack.Screen name="SearchInterestList" component={SearchInterestScreen} />
      <InterestStack.Screen name="SearchInterestResult" component={SearchInterestResultScreen} />
    </InterestStack.Navigator>
  );
}
