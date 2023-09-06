import { View, Text } from 'react-native';
import React from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import Toast from 'react-native-root-toast';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { mapIcon } from '../../constants/IconsMapping';
import ProfileRowItem from '../../components/Profile/ProfileRowItem';
import { logout } from '~/storage/userToken';
import { logoutUser, patchUserToken } from '~/store/userSlice';
import { useAppDispatch } from '~/store';

const useStyles = makeStyles(theme => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
}));

export default function ProfileSettingScreen(
  props: ProfileStackScreenProps<'ProfileSettingScreen'>,
) {
  const { navigation } = props;
  useCustomHeader({ title: '設定', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const dataRow = [
    {
      title: '通知設定',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      onPress: () => {
        navigation.push('NotificationSetting');
      },
    },
    {
      title: '封鎖設定',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      onPress: () => {
        navigation.push('BlockSetting');
      },
    },
    {
      title: '快速登入',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      onPress: () => {
        navigation.push('FastLoginSettings');
      },
    },
    {
      title: '修改密碼',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      onPress: () => {
        navigation.push('ModifyPasswordFirstSetting');
      },
    },
    {
      title: '帳號設定',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      onPress: () => {
        navigation.push('AccountSettings');
      },
    },
    {
      title: '登出',
      titleStyle: styles.title,
      onPress: async () => {
        try {
          
          await dispatch(logoutUser());
          await logout();
          await dispatch(patchUserToken(''));
          
        } catch (error) {
          Toast.show(JSON.stringify(error));
        }
      },
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      {dataRow.map(item => (
        <ProfileRowItem
          key={item.title}
          title={item.title}
          titleStyle={item.titleStyle}
          rightIcon={item.rightIcon}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
}
