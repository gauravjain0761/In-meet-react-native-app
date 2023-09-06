import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import Toast from 'react-native-root-toast';
import { useAppDispatch } from '~/store';
import { updateLocation } from '~/store/registerSlice';

const useRequestLocation = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const openLocationAsync = async ({ updateRegister = true }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== 'granted') {
      //   Alert.alert(
      //     '為了使用 INMEET 你需要授予對裝置所在位置的存取權限',
      //     '在 「設定」 > 「INMEET」 > 開啟「位置」權限',
      //     [
      //       {
      //         text: '取消',
      //         style: 'cancel',
      //       },
      //       {
      //         text: '允許',
      //         onPress: async () => {
      //           if (Platform.OS === 'android') {
      //             await Linking.openSettings();
      //           }
      //           if (Platform.OS === 'ios') {
      //             await Linking.openURL('app-settings:');
      //           }
      //         },
      //       },
      //     ],
      //   );
      // }
      const location = await Location.getLastKnownPositionAsync({});

      if (updateRegister) {
        dispatch(
          updateLocation({
            latitude: location?.coords.latitude as number,
            longitude: location?.coords.longitude as number,
          }),
        );
      }
      return { latitude: location?.coords.latitude, longitude: location?.coords.longitude };
    } catch (error) {
      return {};
    }
  };
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        return true;
      }
      return navigation.navigate('LocationPermission');
    } catch (error) {
      return false;
    }
  };
  return [openLocationAsync, requestLocationPermission, checkLocationPermission];
};

export default useRequestLocation;
