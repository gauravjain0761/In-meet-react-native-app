import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import EditProfileAboutMe from '~/screens/Profile/Edit/EditProfileAboutMe';
import EditProfileEducation from '~/screens/Profile/Edit/EditProfileEducation';
import EditProfileBioScreen from '~/screens/Profile/Edit/EditProfileBioScreen';
import EditProfileEmail from '~/screens/Profile/Edit/EditProfileEmail';
import EditProfileHeightScreen from '~/screens/Profile/Edit/EditProfileHeightScreen';
import EditProfileInterestScreen from '~/screens/Profile/Edit/EditProfileInterestScreen';
import EditProfileJobScreen from '~/screens/Profile/Edit/EditProfileJobScreen';
import EditProfileLocation from '~/screens/Profile/Edit/EditProfileLocation';
import EditProfileReligionScreen from '~/screens/Profile/Edit/EditProfileReligionScreen';
import EditProfileBloodScreen from '~/screens/Profile/Edit/EditProfileBloodScreen';
import EditProfileNameScreen from '~/screens/Profile/Edit/EditProfileNameScreen';
import EditProfileContactScreen from '~/screens/Profile/Edit/EditProfileContactScreen';

export type EditProfileStackParamList = {
  EditProfileAboutMe: undefined;
  EditProfileEducation: undefined;
  EditProfileBioScreen: undefined;
  EditProfileEmail: undefined;
  EditProfileHeightScreen: undefined;
  EditProfileInterestScreen: undefined;
  EditProfileJobScreen: undefined;
  EditProfileLocation: undefined;
  EditProfileReligionScreen: undefined;
  EditProfileBloodScreen: undefined;
  EditProfileContactScreen: undefined;
  EditProfileNameScreen: undefined;
};
export type EditProfileStackProps<Screen extends keyof EditProfileStackParamList> =
  NativeStackScreenProps<EditProfileStackParamList, Screen>;
const EditProfileStack = createNativeStackNavigator<EditProfileStackParamList>();

export default function EditProfileNavigator() {
  return (
    <EditProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <EditProfileStack.Screen name="EditProfileAboutMe" component={EditProfileAboutMe} />
      <EditProfileStack.Screen name="EditProfileEducation" component={EditProfileEducation} />
      <EditProfileStack.Screen name="EditProfileBioScreen" component={EditProfileBioScreen} />
      <EditProfileStack.Screen name="EditProfileEmail" component={EditProfileEmail} />
      <EditProfileStack.Screen name="EditProfileNameScreen" component={EditProfileNameScreen} />
      <EditProfileStack.Screen name="EditProfileHeightScreen" component={EditProfileHeightScreen} />
      <EditProfileStack.Screen
        name="EditProfileInterestScreen"
        component={EditProfileInterestScreen}
      />
      <EditProfileStack.Screen name="EditProfileJobScreen" component={EditProfileJobScreen} />
      <EditProfileStack.Screen name="EditProfileLocation" component={EditProfileLocation} />
      <EditProfileStack.Screen
        name="EditProfileReligionScreen"
        component={EditProfileReligionScreen}
      />

      <EditProfileStack.Screen name="EditProfileBloodScreen" component={EditProfileBloodScreen} />
      <EditProfileStack.Screen
        name="EditProfileContactScreen"
        component={EditProfileContactScreen}
      />
    </EditProfileStack.Navigator>
  );
}
