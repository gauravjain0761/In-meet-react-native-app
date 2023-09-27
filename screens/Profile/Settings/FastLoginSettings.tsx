import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme, makeStyles } from '@rneui/themed';
import { Switch } from 'react-native-paper';
import { Divider } from '@rneui/base';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { get } from 'lodash';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as ExpoFacebook from 'expo-facebook';
import LineLogin, { LoginPermission } from '@xmartlabs/react-native-line';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { SubTitleOne, SubTitleTwo } from '../../../components/common/Text';
import { RootState, useAppDispatch } from '~/store';
import {
  patchUserFastLogin,
  patchUserSocial,
  patchUserUnbindFastLogin,
  selectUserId,
} from '~/store/userSlice';
import CommonModalComponent from '~/components/common/CommonModalComponent';
import { mapIcon } from '~/constants/IconsMapping';
import { useHeaderHeight } from '@react-navigation/elements';
import ReportModal from '~/components/common/ReportModal';

const useStyles = makeStyles((theme) => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  descriptionStyle: {
    color: theme.colors?.black4,
    // flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  footerContainer: {
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: theme.colors.black2,
  },
  textfavorite: {
    color: theme.colors.white,
  },
  unChosenBtnStyle: {
    marginTop: 10,
    width: 185,
    alignSelf:'center'
  },
}));

function SwitchComponent({ enable, onSwitch }: { enable: boolean; onSwitch: () => void }) {
  const { theme } = useTheme();

  return (
    <Switch
      style={{
        margin: 4,
        borderColor: theme.colors.black4,
        transform: Platform.OS === 'android' ? [] : [{ scaleX: 0.7 }, { scaleY: 0.7 }],
      }}
      ios_backgroundColor={theme.colors.black1}
      thumbColor={enable ? theme.colors.black4 : theme.colors.black4}
      color={enable ? theme.colors.pink : theme.colors.black4}
      value={enable}
      onValueChange={onSwitch}
    />
  );
}
WebBrowser.maybeCompleteAuthSession();

export default function FastLoginSettings(props: ProfileStackScreenProps<'FastLoginSettings'>) {
  const { navigation } = props;

  const { theme } = useTheme();
  const styles = useStyles();
  const headerHeight = useHeaderHeight();

  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const userEmail = useSelector((state: RootState) => state.user.account);
  const { facebook, google, line, apple } = useSelector((state: RootState) => state.user);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [type, setType] = React.useState('確定要解除Facebook綁定嗎？');
  const resolveCallback = useRef(null);
  const { accessToken } = useSelector((rootState: RootState) => rootState.fastLogin);
  const [_, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    // from firebase google
    androidClientId: '1037316389652-6jufof7i37r441rtjmn61ed7754gpb74.apps.googleusercontent.com',
    clientId: '1037316389652-rdpfj1op7edu5jemrjosnq853s2k3489.apps.googleusercontent.com',
    iosClientId: '1037316389652-gb1ervtr4h8ukj25nrum2h907ubsvsl4.apps.googleusercontent.com',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '快速登入',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });

  const requestForConfirm = () => {
    setCollectionModal(true);
    return new Promise((resolve) => {
      resolveCallback.current = resolve;
    });
  };

  const onConfirm = () => {
    setCollectionModal(false);
    if (resolveCallback.current) {
      resolveCallback.current(true);
    }
  };

  const onCancel = () => {
    setCollectionModal(false);
    if (resolveCallback.current) {
      resolveCallback.current(false);
    }
  };

  const handlePatchAccessToken = async (data, type) => {
    try {
      const res = await dispatch(patchUserFastLogin({ userEmail, ...data, type })).unwrap();
      dispatch(patchUserSocial({ ...data, value: res.data.email, type }));
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  const handleUnBindAccessToken = async (data) => {
    try {
      const res = await dispatch(patchUserUnbindFastLogin({ ...data })).unwrap();
      dispatch(patchUserSocial({ ...data, value: '' }));
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  const linePromptAsync = async () => {
    try {
      const loginResult = await LineLogin?.login({
        scopes: [LoginPermission.EMAIL, LoginPermission.PROFILE, LoginPermission.OPEN_ID],
      });
      if (loginResult.accessToken.id_token) {
        handlePatchAccessToken({ line: { accessToken: loginResult.accessToken.id_token } }, 'LINE');
      }
    } catch (error) {
      Toast.show('快速登入失敗');
    }
  };

  const fbPromptAsync = async () => {
    try {
      await ExpoFacebook.initializeAsync({
        appId: '799427287833790',
      });
      const { type, token } = await ExpoFacebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        handlePatchAccessToken({ facebook: { accessToken: token } }, 'FACEBOOK');
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const applePromptAsync = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const id_token = get(credential, 'identityToken', '');
      handlePatchAccessToken({ apple: { accessToken: id_token } }, 'APPLE');

      // signed in
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { idToken } = googleResponse.authentication;
      handlePatchAccessToken({ google: { accessToken: idToken } }, 'GOOGLE');
    }
    return () => {};
  }, [googleResponse]);

  const notificationSettings = [
    {
      title: 'Facebook 綁定',
      onSwitch: async () => {
        try {
          if (facebook) {
            setType('確定要解除Facebook綁定嗎？');
            const res = await requestForConfirm();
            if (!res) return;
            await handleUnBindAccessToken({ type: 'FACEBOOK' });
            return;
          }
          setType('要開始進行Facebook綁定嗎？');
          await fbPromptAsync();
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
      },
      value: Boolean(facebook),
    },
    {
      title: 'Google 綁定',
      onSwitch: async () => {
        try {
          if (google) {
            setType('確定要解除Google綁定嗎？');
            const res = await requestForConfirm();
            if (!res) return;
            await handleUnBindAccessToken({ type: 'GOOGLE' });
            return;
          }
          setType('要開始進行Google綁定嗎？');
          await googlePromptAsync();
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
      },
      value: Boolean(google),
    },
    {
      title: 'Line 綁定',
      onSwitch: async () => {
        try {
          if (line) {
            setType('確定要解除Line綁定嗎？');
            const res = await requestForConfirm();
            if (!res) return;
            await handleUnBindAccessToken({ type: 'LINE' });
            return;
          }
          setType('要開始進行Line綁定嗎？');
          await linePromptAsync();
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
      },
      value: Boolean(line),
    },
    {
      title: 'Apple 綁定',
      onSwitch: async () => {
        try {
          if (apple) {
            setType('確定要解除Apple綁定嗎？');
            const res = await requestForConfirm();
            if (!res) return;
            await handleUnBindAccessToken({ type: 'APPLE' });
            return;
          }
          setType('要開始進行Apple綁定嗎？');
          await applePromptAsync();
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
      },
      value: Boolean(apple),
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: headerHeight - 10 }}>
      <View style={styles.footerContainer}>
        {notificationSettings.map((setting) => (
          <View key={setting.title} style={{ paddingTop:12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}>
              <SubTitleTwo style={{ color: theme.colors.white }}>{setting.title}</SubTitleTwo>
              <SwitchComponent enable={setting.value} onSwitch={setting.onSwitch} />
            </View>
            {/* <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} /> */}
          </View>
        ))}
      </View>
      {/* <CommonModalComponent
        modalText={type}
        isVisible={collectionModal}
        onConfirm={onConfirm}
        onClose={onCancel}
      /> */}
       <ReportModal
        modalText={type}
        buttonOneTitle = '刪除'
        buttonTwoTitle = '取消'
        headerShow={true}
        isVisible={collectionModal}
        onConfirm={onConfirm}
        showCancel={true}
        headerShowText={'解除綁定'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={onCancel}
      />
    </View>
  );
}
