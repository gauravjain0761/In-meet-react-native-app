import { View, Text, Platform ,Linking} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { Switch } from 'react-native-paper';
import { Divider } from '@rneui/base';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { SubTitleOne } from '../../../components/common/Text';
import { RootState, useAppDispatch } from '~/store';
import Loader from '~/components/common/Loader';
import { patchUserNotification } from '~/store/userSlice';
import BannerModal from '~/components/common/BannerModal';
import useFirebaseMessages from '~/hooks/useFirebaseMessages';
import messaging from '@react-native-firebase/messaging';


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

export default function NotificationSetting(props: ProfileStackScreenProps<'NotificationSetting'>) {
  const { navigation } = props;
  useCustomHeader({ title: '通知設定', navigation });
  const { theme } = useTheme();
  const { isLikeEnable, isBlogEnable, isMessageEnable, isSystemEnable, deviceToken } = useSelector(
    (state: RootState) => state.user,
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
        }else{
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
    }else return true;
  };
  const notificationSettings = [
    {
      title: '收到喜歡時',
      onSwitch: async newValue => {
        try {
          const havePermission = await handleOn();
          if(havePermission){
          setIsLoading(true);
          await dispatch(
            patchUserNotification({
              deviceToken,
              isLikeEnable: newValue,
              isBlogEnable,
              isMessageEnable,
              isSystemEnable,
            }),
          );}
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isLikeEnable,
    },
    {
      title: '收到新訊息時',
      onSwitch: async newValue => {
        try {
          const havePermission = await handleOn();
          if(havePermission){
          setIsLoading(true);
          await dispatch(
            patchUserNotification({
              deviceToken,
              isLikeEnable,
              isBlogEnable ,
              isMessageEnable : newValue,
              isSystemEnable,
            }),
          );}
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isMessageEnable,
    },
    {
      title: '收到動態回應時',
      onSwitch: async newValue => {
        await handleOn();
        try {
          const havePermission = await handleOn();
          if(havePermission){
          setIsLoading(true);
          await dispatch(
            patchUserNotification({
              deviceToken,
              isLikeEnable,
              isBlogEnable : newValue,
              isMessageEnable ,
              isSystemEnable,
            }),
          );}
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isBlogEnable,
    },
    {
      title: '系統通知',
      onSwitch: async newValue => {
        await handleOn();
        try {
          const havePermission = await handleOn();
          if(havePermission){
          setIsLoading(true);
          await dispatch(
            patchUserNotification({
              deviceToken,
              isLikeEnable,
              isBlogEnable,
              isMessageEnable,
              isSystemEnable : newValue,
            }),
          );}
        } catch (error) {
          // Toast.show(JSON.stringify(error));
        }
        setIsLoading(false);
      },
      value: isSystemEnable,
    },
  ];
  return (
    <Loader isLoading={isLoading}>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        {notificationSettings.map(setting => (
          <View key={setting.title} style={{ paddingTop: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}>
              <SubTitleOne style={{ color: theme.colors.white }}>{setting.title}</SubTitleOne>
              <SwitchComponent enable={setting.value} onSwitch={setting.onSwitch} />
            </View>
            <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} />
          </View>
        ))}
      </View>
    </Loader>
  );
}
