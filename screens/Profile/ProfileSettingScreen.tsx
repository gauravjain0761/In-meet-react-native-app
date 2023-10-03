import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import Toast from 'react-native-root-toast';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { mapIcon } from '../../constants/IconsMapping';
import ProfileRowItem from '../../components/Profile/ProfileRowItem';
import { logout } from '~/storage/userToken';
import { logoutUser, patchUserToken } from '~/store/userSlice';
import { useAppDispatch } from '~/store';
import ProfileRowItemNew from '~/components/Profile/ProfileRowItemNew';
import SafeAreaView from 'react-native-safe-area-view';
import { useHeaderHeight } from '@react-navigation/elements';
import { BodyThree } from '~/components/common/Text';

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

export default function ProfileSettingScreen(
  props: ProfileStackScreenProps<'ProfileSettingScreen'>
) {
  const { navigation } = props;
  const headerHeight = useHeaderHeight();

  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();

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

  const dataRow1 = [
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
  ];
  const dataRow2 = [
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
  ];
  const dataRow3 = [
    {
      title: '還原訂閱',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.nextStepIcon(),
      description: '去訂閱',
      descriptionStyle:styles.descriptionStyle,
      onPress: () => {
        navigation.push('VIPPurchaseScreen');
      },
    },
  ];

 const onLogoutPress =async()=>{
  try {
    await dispatch(logoutUser());
    await logout();
    await dispatch(patchUserToken(''));
  } catch (error) {
    Toast.show(JSON.stringify(error));
  }
 }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: headerHeight - 10 }}>
      <View style={styles.footerContainer}>
        {dataRow1.map((item) => (
          <ProfileRowItemNew
            showIcon={false}
            key={item.title}
            title={item.title}
            titleStyle={item.titleStyle}
            rightIcon={item.rightIcon}
            onPress={item.onPress}
            // description={item.description}
            // descriptionStyle={item.descriptionStyle}
          />
        ))}
      </View>
      <View style={styles.footerContainer}>
        {dataRow2.map((item) => (
          <ProfileRowItemNew
            showIcon={false}
            key={item.title}
            title={item.title}
            titleStyle={item.titleStyle}
            rightIcon={item.rightIcon}
            onPress={item.onPress}
            // description={item.description}
            // descriptionStyle={item.descriptionStyle}
          />
        ))}
      </View>
      <View style={styles.footerContainer}>
        {dataRow3.map((item) => (
          <ProfileRowItemNew
            showIcon={false}
            key={item.title}
            title={item.title}
            titleStyle={item.titleStyle}
            rightIcon={item.rightIcon}
            onPress={item.onPress}
            description={item.description}
            descriptionStyle={item.descriptionStyle}
          />
        ))}
      </View>
      <TouchableOpacity onPress={onLogoutPress} style={[styles.footerContainer,{alignItems:'center'}]}>
        <BodyThree style={styles.textfavorite}>登出</BodyThree>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
