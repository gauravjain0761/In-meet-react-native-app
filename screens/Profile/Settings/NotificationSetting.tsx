import { View, Text, Platform, Linking, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { Switch } from 'react-native-paper';
import { Divider } from '@rneui/base';
import { makeStyles } from '@rneui/themed';

import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { BodyOne, SubTitleOne } from '../../../components/common/Text';
import { RootState, useAppDispatch } from '~/store';
import Loader from '~/components/common/Loader';
import { patchUserNotification } from '~/store/userSlice';
import BannerModal from '~/components/common/BannerModal';
import useFirebaseMessages from '~/hooks/useFirebaseMessages';
import messaging from '@react-native-firebase/messaging';
import { mapIcon } from '~/constants/IconsMapping';
import { useHeaderHeight } from '@react-navigation/elements';
import SwitchToggle from 'react-native-switch-toggle';

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
}));

function SwitchComponent({ enable, onSwitch }: { enable: boolean; onSwitch: () => void }) {
  const { theme } = useTheme();

  return (
    // <Switch
    //   style={{
    //     margin: 4,
    //     borderColor: theme.colors.black4,
    //     transform: Platform.OS === 'android' ? [] : [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    //   }}
    //   ios_backgroundColor={theme.colors.black1}
    //   thumbColor={enable ? theme.colors.white : theme.colors.white}
    //   color={enable ? theme.colors.pink : theme.colors.black4}
    //   value={enable}
    //   onValueChange={onSwitch}
    // />

    <SwitchToggle
      switchOn={enable}
      onPress={onSwitch}
      backgroundColorOn="#FF4E84"
      backgroundColorOff="#A8ABBD"
      circleColorOn="#fff"
      circleColorOff="#fff"
      containerStyle={{
        marginTop: 16,
        width: 48,
        height: 26,
        borderRadius: 20,
        padding: 4,
        alignItems: 'center',
      }}
      circleStyle={{
        width: 22,
        height: 22,
        borderRadius: 22,
        backgroundColor: '#fff',
      }}
    />
  );
}

export default function NotificationSetting(props: ProfileStackScreenProps<'NotificationSetting'>) {
  const { navigation } = props;
  const styles = useStyles();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '設定',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();

  const { isLikeEnable, isBlogEnable, isMessageEnable, isSystemEnable, deviceToken } = useSelector(
    (state: RootState) => state.user
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { requestUserPermission } = useFirebaseMessages();
  const getCurrentDeviceToken = async () => {
    try {
      return await requestUserPermission();
    } catch (error) {
      Toast.show(JSON.stringify(error));
      return undefined;
    }
  };
  const handleOn = async () => {
    const currentDeviceToken = await getCurrentDeviceToken();
    if (!deviceToken || deviceToken !== currentDeviceToken) {
      try {
        const token = await requestUserPermission();
        if (token) {
          await dispatch(patchUserNotification({ deviceToken: token })).unwrap();
          return true;
        } else {
          Toast.show('通知設定已關閉，請至設定開啟通知。');
          if (Platform.OS === 'android') {
            await Linking.openSettings();
          }
          if (Platform.OS === 'ios') {
            await Linking.openURL('app-settings:');
          }
          return false;
        }
      } catch (error) {
        // Toast.show(JSON.stringify(error));
      }
    } else return true;
  };
  const notificationSettings = [
    {
      title: '看過我',
      onSwitch: async (newValue) => {
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable: !isLikeEnable,
                isBlogEnable,
                isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isLikeEnable,
    },
    {
      title: '收到喜歡時',
      onSwitch: async (newValue) => {
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable: !isLikeEnable,
                isBlogEnable,
                isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isLikeEnable,
    },
    {
      title: '配對成功',
      onSwitch: async (newValue) => {
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable: !isLikeEnable,
                isBlogEnable,
                isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isLikeEnable,
    },
    {
      title: '收到新訊息時',
      onSwitch: async (newValue) => {
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable,
                isBlogEnable,
                isMessageEnable: !isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isMessageEnable,
    },
    {
      title: '喜歡對象的動態',
      onSwitch: async (newValue) => {
        await handleOn();
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable,
                isBlogEnable,
                isMessageEnable,
                isSystemEnable: !isSystemEnable,
              })
            );
          }
        } catch (error) {
          // Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isSystemEnable,
    },
    {
      title: '收到動態回應時',
      onSwitch: async (newValue) => {
        await handleOn();
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable,
                isBlogEnable: !isBlogEnable,
                isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isBlogEnable,
    },
  ];
  const dataRow1 = [
    {
      title: '系統通知',
      onSwitch: async (newValue) => {
        await handleOn();
        try {
          const havePermission = await handleOn();
          if (havePermission) {
            setIsLoading(true);
            await dispatch(
              patchUserNotification({
                deviceToken,
                isLikeEnable,
                isBlogEnable,
                isMessageEnable: !isMessageEnable,
                isSystemEnable,
              })
            );
          }
        } catch (error) {
          // Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isMessageEnable,
    },
  ];
  return (
    <Loader isLoading={isLoading}>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: headerHeight - 10 }}>
        <View style={styles.footerContainer}>
          {notificationSettings.map((setting) => (
            <View key={setting.title} style={{ paddingTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                }}>
                <BodyOne style={{ color: theme.colors.white }}>{setting.title}</BodyOne>
                <SwitchComponent enable={setting.value} onSwitch={setting.onSwitch} />
              </View>
              {/* <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} /> */}
            </View>
          ))}
        </View>
        <View style={styles.footerContainer}>
          {dataRow1.map((setting) => (
            <View key={setting.title}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                }}>
                <BodyOne style={{ color: theme.colors.white }}>{setting.title}</BodyOne>
                <SwitchComponent enable={setting.value} onSwitch={setting.onSwitch} />
              </View>
              {/* <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} /> */}
            </View>
          ))}
        </View>
      </View>
    </Loader>
  );
}
