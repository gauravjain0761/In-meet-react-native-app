import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { uniqueId } from 'lodash';
import { BodyThree, SubTitleOne, TitleOne } from '../../components/common/Text';
import { ButtonTypeOne, ButtonTypeTwo, UnChosenButton } from '../../components/common/Button';
import { RegisterLocationScreenProps } from '../../types';
import ProgressBar from '../../components/common/ProgressBar';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '~/store';
import { cleanUpRegister, patchRegister } from '~/store/registerSlice';
import {
  getUserInfo,
  initUser,
  loginUser,
  patchUserFastLogin,
  patchUserFromRegister,
  patchUserToken,
} from '~/store/userSlice';
import useRequestLocation from '~/hooks/useRequestLocation';
import { clearUserStorage, storeUserIsFromRegistered, storeUserToken } from '~/storage/userToken';
import useUploadFile from '~/hooks/useUploadFile';
import uploadFile from '~/store/fileSlice';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bodyText: {
    color: theme.colors?.black4,
    paddingBottom: 30,
    textAlign: 'center',
  },

  footerContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 100,
    flexGrow: 1,
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
export default function RegisterLocationScreen(props: RegisterLocationScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const dispatch = useAppDispatch();
  const register = useSelector((state: RootState) => state.register);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLocationAsync] = useRequestLocation();
  const { accessToken, type } = useSelector((rootState: RootState) => rootState.fastLogin);

  const onRequest = async ({ latitude, longitude }) => {
    try {
      setLoading(true);
      const socialEmail = {
        ...(type === 'FACEBOOK' && { facebook: register.email }),
        ...(type === 'LINE' && { line: register.email }),
        ...(type === 'GOOGLE' && { google: register.email }),
        ...(type === 'APPLE' && { apple: register.email }),
      };

      const { data } = await dispatch(
        patchRegister({ ...register, email: `${register.email}`, ...socialEmail }),
      ).unwrap();

      if (data?.id) {
        if (register.avatar) {
          await dispatch(
            uploadFile({
              fileData: {
                type: Platform.OS === 'ios' ? 'image' : 'image/jpg',
                uri:
                  Platform.OS === 'ios' ? register.avatar.replace('file://', '') : register.avatar,
                name: 'unnamed.png',
              },
              fileType: 'AVATAR',
              userId: data?.id,
            }),
          ).unwrap();
        }

        dispatch(cleanUpRegister());
        await storeUserIsFromRegistered('isFromRegistered');
        // clear the data and the flag on landing screen
        await clearUserStorage();
        const loginResponse = await dispatch(
          loginUser({ username: register.email, password: register.password, latitude, longitude }),
        ).unwrap();
        if (loginResponse.code !== 20000) {
          throw loginResponse;
        }
        // await dispatch(getUserInfo({ token: loginResponse.data })).unwrap();
        dispatch(patchUserToken(loginResponse.data));
        dispatch(patchUserFromRegister(true));
        await storeUserToken(loginResponse.data);
        if (type && accessToken) {
          const socialData = {
            ...(type === 'FACEBOOK' && { facebook: { accessToken, type } }),
            ...(type === 'LINE' && { line: { accessToken, type } }),
            ...(type === 'GOOGLE' && { google: { accessToken, type } }),
            ...(type === 'APPLE' && { apple: { accessToken, type } }),
          };
          const res = await dispatch(
            patchUserFastLogin({ ...socialData, userEmail: register.email }),
          ).unwrap();
        }
      }
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
    setLoading(false);
  };

  const onSubmit = async ({ passLocation = false }) => {
    try {
      const { latitude, longitude } = await openLocationAsync({});
      await onRequest({ latitude, longitude });
    } catch (error) { }
  };

  useLayoutEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error();
        }
        setHasPermission(true);
      } catch (error) { }
    })();
  }, []);

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <ProgressBar step={6} />
        <View style={styles.bodyContainer}>
          <TitleOne style={styles.titleText}>{hasPermission ? '完成' : '就快完成'}</TitleOne>
          <BodyThree style={styles.bodyText}>
            {hasPermission
              ? '您已開啟服務，能準確找到附近用戶'
              : '為了使用 InMeet 你需要授予對裝置所在位置的存取權限'}
          </BodyThree>
          <View style={styles.imageContainer}>{mapIcon.locationLogo()}</View>
        </View>

        <View style={styles.footerContainer}>
          <ButtonTypeTwo
            loading={loading}
            title={
              <SubTitleOne style={styles.chosenButtonText}>
                {hasPermission ? '開始' : '開啟定位'}
              </SubTitleOne>
            }
            onPress={() => onSubmit({ passLocation: false })}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
