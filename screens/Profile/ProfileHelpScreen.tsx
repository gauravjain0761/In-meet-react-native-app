import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@rneui/themed';
import { Divider } from '@rneui/base';
import * as WebBrowser from 'expo-web-browser';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { BodyThree, SubTitleOne } from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';

export default function ProfileHelpScreen(props: ProfileStackScreenProps<'ProfileHelpScreen'>) {
  const { navigation } = props;
  const { theme } = useTheme();
  useCustomHeader({ title: '幫助', navigation });

  const inMeetOverviw = [
    {
      title: 'InMeet是什麼？',
      onPress: () => {
        WebBrowser.openBrowserAsync('https://inmeet.vip/description');
      },
    },
    {
      title: '取得 InMeet VIP',
      onPress: () => {
        WebBrowser.openBrowserAsync('https://inmeet.vip');
      },
    },
  ];

  const dataSettings = [
    {
      title: '怎麼修改電子信箱?',
      onPress: () => {
        WebBrowser.openBrowserAsync(
          'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet',
        );
      },
    },
    {
      title: '怎麼修改個人資料?',
      onPress: () => {
        WebBrowser.openBrowserAsync(
          'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet',
        );
      },
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      <BodyThree style={{ color: theme.colors.white, textAlign: 'center', paddingVertical: 20 }}>
        InMeet概覽
      </BodyThree>
      {inMeetOverviw.map(item => (
        <TouchableOpacity style={{ paddingTop: 16 }} onPress={item.onPress} key={item.title}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <SubTitleOne style={{ color: theme.colors.white }}>{item.title}</SubTitleOne>
            {mapIcon.nextStepIcon({ size: 24 })}
          </View>

          <Divider width={1} color={theme.colors.black2} style={{ paddingTop: 16 }} />
        </TouchableOpacity>
      ))}
      {/* <BodyThree style={{ color: theme.colors.white, textAlign: 'center', paddingVertical: 20 }}>
        資料設定
      </BodyThree>

      {dataSettings.map(item => (
        <TouchableOpacity style={{ paddingTop: 16 }} onPress={item.onPress} key={item.title}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <SubTitleOne style={{ color: theme.colors.white }}>{item.title}</SubTitleOne>
            {mapIcon.nextStepIcon({ size: 24 })}
          </View>

          <Divider width={1} color={theme.colors.black2} style={{ paddingTop: 16 }} />
        </TouchableOpacity>
      ))} */}
    </View>
  );
}
