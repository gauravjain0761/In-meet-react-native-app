import { View, Platform, Linking, TouchableOpacity, Alert ,Image} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { get } from 'lodash';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as ExpoFacebook from 'expo-facebook';
import LineLogin, { LoginPermission } from '@xmartlabs/react-native-line';
import { nanoid } from '@reduxjs/toolkit';
import { PreLoginScreenProps } from '../../types';
import { BodyOne, BodyThree, CaptionFour, SubTitleOne, TitleOne } from '../../components/common/Text';
import Logo from '../../components/common/Logo';
import { ButtonTypeTwo, ChosenButton } from '../../components/common/Button';
import FacebookIcon from '../../components/common/Icon/Facebook';
import GoogleIcon from '../../components/common/Icon/Google';
import Line from '../../components/common/Icon/Line';
import HttpClient from '~/axios/axios';
import { useAppDispatch } from '~/store';
import { updateFastLoginType, FastLoginType, updateAccessToken } from '~/store/fastLoginSlice';
import { patchUserToken, socialLoginUser } from '~/store/userSlice';
import { storeUserToken } from '~/storage/userToken';
import Loader from '~/components/common/Loader';
import { updateEmail, updatePassword } from '~/store/registerSlice';
import { mapIcon } from '~/constants/IconsMapping';

const useStyles = makeStyles(theme => {
  return ({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.black1,
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop: 96,
    },
    subtitleText: {
      color: theme.colors?.white,
      paddingTop: 24,
      fontWeight: '700',
      letterSpacing: 0.56
    },
    captionFourText: {
      color: theme.colors?.white,
      paddingTop: '6%',
    },
    loginButtonContainer: {
      width: '100%',
      marginTop: "4.8%",
    },
    hairline: {
      backgroundColor: theme.colors?.black4,
      height: 1,
      width: 120
    },
    hairlineView: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    socialMediaIconContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    socialMediaIcon: {
      paddingLeft: 40,
    },
    buttonContainer: {
      width: '100%',
      justifyContent: 'flex-end',
    },
    registerButtonContainer: {
      marginTop: '4.8%',
      width: '100%',
    },
    bodyText: {
      color: theme.colors?.black4,
      marginHorizontal: 16
    },
  });
});

WebBrowser.maybeCompleteAuthSession();

export default function PreLoginScreen(props: PreLoginScreenProps) {
  const { navigation } = props;
  const styles = useStyles(props);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [_, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    // from firebase google
    androidClientId: '1037316389652-6jufof7i37r441rtjmn61ed7754gpb74.apps.googleusercontent.com',
    clientId: '1037316389652-rdpfj1op7edu5jemrjosnq853s2k3489.apps.googleusercontent.com',
    iosClientId: '1037316389652-gb1ervtr4h8ukj25nrum2h907ubsvsl4.apps.googleusercontent.com',
  });
console.log('googleResponse',googleResponse);

  const handlePressRegister = () => {
    navigation.push('RegisterPhone');
  };

  const handlePressLogin = () => {
    navigation.push('Login');
  };

  const handlePressPhoneLogin = () => {
    navigation.push('PhoneLogin');
  };

  const handleNextStep = async ({
    type,
    accessToken,
  }: {
    type: FastLoginType;
    accessToken: string;
  }) => {
    try {
      console.log('type',type);
      console.log('type accessToken',accessToken);
      
      const res = await dispatch(socialLoginUser({ type, accessToken })).unwrap();
      console.log("tokennnnn",res);

      if (res.data.token) {
        // await dispatch(getUserInfo({ token: res.data.token })).unwrap();
        await dispatch(patchUserToken(res.data.token));
        await storeUserToken(res.data.token);
        return;
      }
      await dispatch(updateFastLoginType({ type }));
      await dispatch(updateAccessToken({ accessToken }));
      if (!res.data.email) {
        Toast.show('無法取得電子郵件，請確認是否有電子郵件');
        return;
      }
      if (type === 'APPLE') {
        // handle for apple without requesting user to input password and email
        dispatch(updateEmail(res.data.email));
        dispatch(updatePassword(nanoid()));
        navigation.push('RegisterName');
        return;
      }
      // navigation.push('FastLoginEmailScreen', {
      //   email: res.data.email,
      // });
      navigation.push('RegisterPhone');
    } catch (error) {
      if (error?.message === '該用戶已經註冊') {
        Toast.show('此電子郵件已註冊，請登入後再至「個人」>「設定」>「快速登入」綁定第三方平台', {
          duration: 3000,
        });
        return;
      }
      Toast.show('快速登入失敗');
    }
  };

  const getGoogleUser = async (accessToken: string) => {
    try {
      const data = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) { }
  };

  const getAccessToken = async res => {
    const state = get(res, 'params.state', '');
    const code = get(res, 'params.code', '');
    if (!code || !state) return;

    try {
      const data = await HttpClient.post(
        'https://api.line.me/oauth2/v2.1/token',
        `grant_type=authorization_code&code=${code}&redirect_uri=https://auth.expo.io/@sean_hsieh/inmeet-react-native&client_id=1657559635&client_secret=83a9f4c1ec2b1e7e6c4e0d8fedf0063b`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      // To get user info call POST https://api.line.me/oauth2/v2.1/verify and formdata with id_token and client_id
      const accessToken = get(data, 'data.id_token', '');
      handleNextStep({
        type: 'LINE',
        accessToken,
      });
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      console.log('googleResponse.authentication',googleResponse.authentication);
      
      const { idToken } = googleResponse.authentication;
      if (idToken) {
        handleNextStep({
          type: 'GOOGLE',
          accessToken: idToken,
        });
      }

      // getGoogleUser(accessToken);
      // const credential = GoogleAuthProvider.credential(id_token);
    }
  }, [googleResponse]);

  const socialMediaArray = [
    <FacebookIcon
      onPress={async () => {
        setLoading(true);

        try {
          await ExpoFacebook.initializeAsync({
            appId: '799427287833790',
          });
          const { type, token } = await ExpoFacebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            handleNextStep({
              type: 'FACEBOOK',
              accessToken: token,
            });
          } else {
            Toast.show('快速登入失敗');

            // type === 'cancel'
          }
        } catch ({ message }) {
          Toast.show('快速登入失敗');
        }
        setLoading(false);
      }}
    />,
    <GoogleIcon
      onPress={async () => {
        setLoading(true);
        try {
          await googlePromptAsync();
        } catch (error) { }
        setLoading(false);
      }}
    />,
    <Line
      onPress={async () => {
        setLoading(true);

        try {
          const loginResult = await LineLogin?.login({
            scopes: [LoginPermission.EMAIL, LoginPermission.PROFILE, LoginPermission.OPEN_ID],
          });
          if (loginResult.accessToken.id_token) {
            handleNextStep({
              type: 'LINE',
              accessToken: loginResult.accessToken.id_token,
            });
          }
        } catch (error) {
          Toast.show('快速登入失敗');
        }
        setLoading(false);
      }}
    />,
    Platform.OS !== 'android' && (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={40}
        style={{ width: 40, height: 40 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
            });
            handleNextStep({
              type: 'APPLE',
              accessToken: credential.identityToken,
            });
            // signed in
          } catch (e) {
            if (e.code === 'ERR_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    ),
  ];

  const handlePress = useCallback(async target => {
    let url;
    if (target === 'terms') {
      url = 'https://inmeet.vip/terms-of-use';
    } else url = 'https://inmeet.vip/privacy-policy';
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <Image
              source={mapIcon.illus3zIcon}
              style={{
                width: 332,
                height: 203,
                position: 'absolute',
                right:0
              }}
            />
      <Loader isLoading={loading}>
        <Logo style={{ width: 91, height: 80 }} />
        <TitleOne style={styles.subtitleText}>InMeet</TitleOne>
        <BodyThree style={[styles.captionFourText, { paddingTop: '8%' }]}>
          24 小時的新旅程，在 InMeet 等您
        </BodyThree>
        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            bottom: '4%',
          }}>
          <BodyThree style={[styles.captionFourText, { marginTop: '2%' }]}>快速登入</BodyThree>
          <View style={styles.socialMediaIconContainer}>
            {socialMediaArray.filter(Boolean).map((mediaIcon, index) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                key={index}>
                {mediaIcon}
              </View>
            ))}
          </View>
          <View style={styles.hairlineView}>
          <View style={styles.hairline} />
          <BodyOne style={styles.bodyText}>{"或"}</BodyOne>
          <View style={styles.hairline} />

          </View>
          <ChosenButton
            onPress={handlePressLogin}
            containerStyle={styles.loginButtonContainer}
            title="使用 E-mail 登入"
            icon={mapIcon.envelopeIcon({size: 20})}
            // iconLeft
            titleStyle={{fontWeight:'700' }}
            iconContainerStyle={{ position: 'absolute', left: 20, }}
          />
          <ChosenButton
            onPress={handlePressPhoneLogin}
            containerStyle={styles.loginButtonContainer}
            title="使用 手機號碼登入"
            icon={mapIcon.mobileIcon({size: 20})}
            // iconLeft
            iconContainerStyle={{ position: 'absolute', left: 20 }}
          />
          <ButtonTypeTwo
            onPress={handlePressRegister}
            containerStyle={styles.registerButtonContainer}
            title="註冊"
          />
          <View style={{ display: 'flex', flexDirection: 'row',marginTop:"2%" }}>
            <CaptionFour style={styles.captionFourText}>繼續則表示您接受我們的</CaptionFour>
            <TouchableOpacity onPress={() => handlePress('terms')}>
              <CaptionFour style={[styles.captionFourText, { color: '#FF4E84' }]}>
                {' '}
                服務條款{' '}
              </CaptionFour>
            </TouchableOpacity>
            <CaptionFour style={styles.captionFourText}>與</CaptionFour>
            <TouchableOpacity onPress={() => handlePress('privacy')}>
              <CaptionFour style={[styles.captionFourText, { color: '#FF4E84' }]}>
                {' '}
                隱私權政策{' '}
              </CaptionFour>
            </TouchableOpacity>
          </View>
        </View>
      </Loader>
    </SafeAreaView>
  );
}
