import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginScreenProps, PhoneLoginScreenProps } from '../../types';
import { BodyThree, BodyTwo, CaptionFour, TitleOne } from '../../components/common/Text';
import { ButtonTypeTwo } from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { mapIcon } from '../../constants/IconsMapping';
import { useAppDispatch } from '~/store';
import { getUserInfo, loginUser, patchUserToken } from '~/store/userSlice';
import { storeUserToken } from '~/storage/userToken';
import useRequestLocation from '~/hooks/useRequestLocation';
import Header from '~/components/common/Header';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  subtitleText: {
    color: theme.colors?.white,
    // paddingTop: 100,
    paddingVertical: 40,
    textAlign: 'center',
  },

  loginButtonContainer: {
    // width: '100%',
    marginHorizontal:40
  },
  forgetButtonText: {
    color: theme.colors?.black5,
    textAlign: 'center',
    paddingTop: 15,
    textDecorationLine: 'underline',
    lineHeight: 15,
  },
}));

export default function PhoneLoginScreen(props: PhoneLoginScreenProps) {
  const { navigation } = props;
  const styles = useStyles(props);
  const methods = useForm({
    mode: 'onSubmit',
  });
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLocationAsync, __, checkLocationPermission] = useRequestLocation();
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = methods;

  const handlePressLogin = async (data: any) => {
    const { phone, password } = data;
    try {
      setLoading(true);
      const { latitude, longitude } = await openLocationAsync({ updateRegister: false });
      const loginResponse = await dispatch(
        loginUser({
          username: phone,
          password,
          latitude,
          longitude,
        }),
      ).unwrap();

      if (loginResponse.code !== 20000) {
        throw loginResponse;
      }
      // await dispatch(getUserInfo({ token: loginResponse.data })).unwrap();
      dispatch(patchUserToken(loginResponse.data));
      await storeUserToken(loginResponse.data);
    } catch (error) {
      console.log('error: ', error);
      setError(
        'password',
        {
          message: '密碼長度或內容不正確',
        },
        { shouldFocus: false },
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePressForgetPassword = () => {
    navigation.push('ForgetPassword');
  };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerShadowVisible: false,
  //     headerStyle: styles.headerStyle,
  //     headerTintColor: theme.colors.white,
  //     headerBackTitleVisible: false,
  //     headerTitleAlign: 'center',
  //     headerTitle: props => {
  //       return <></>;
  //     },
  //   });
  // });

  return (   
    <KeyboardAwareScrollView style={[styles.container, { paddingHorizontal: 0 }]}>
      <FormProvider {...methods}>
          <View style={[styles.container]}>
        <Header containerStyle={{paddingHorizontal:20}}/>
        <Image
              source={mapIcon.illus3zIcon}
              style={{
                width: 332,
                height: 203,
                position: 'absolute',
                right:0
              }}
            />
          <TitleOne style={styles.subtitleText}>登入</TitleOne>
          <InputField
            label="電話"
            name="phone"
            placeholder="請輸入電話號碼"
            textContentType="telephoneNumber"
            rules={{
              required: '這是必填欄位',
              pattern: {
                value: /((?=(09))[0-9]{10})$/i,
                message: '輸入的格式不正確',
              },
            }}
            styles={{}}
            containerStyle={{marginHorizontal:40}}

          />
          <InputField
            name="password"
            label="密碼"
            placeholder="請輸入密碼"
            textContentType="none"
            rules={{
              required: '這是必填欄位',
            }}
            styles={{}}
            secureTextEntry={!visiblePassword}
            onRightPress={() => setVisiblePassword(!visiblePassword)}
            // right={mapIcon.invisiblePassword()}
            containerStyle={{marginHorizontal:40,paddingVertical:16}}


          />

          <ButtonTypeTwo
            onPress={handleSubmit(handlePressLogin)}
            containerStyle={styles.loginButtonContainer}
            loading={loading}
            title="登入"
          />
          <TouchableOpacity onPress={handlePressForgetPassword}>
            <BodyThree style={styles.forgetButtonText}>忘記密碼</BodyThree>
          </TouchableOpacity>
        </View>
      </FormProvider>
    </KeyboardAwareScrollView>
  
  );
}
