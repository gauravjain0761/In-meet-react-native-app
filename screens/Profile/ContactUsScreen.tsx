import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { mapIcon } from '../../constants/IconsMapping';
import { BodyOne, BodyThree, BodyTwo } from '../../components/common/Text';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
}));

export default function ContactUsScreen(props: ProfileStackScreenProps<'ContactUsScreen'>) {
  const { theme } = useTheme();
  const styles = useStyles();
  const { navigation } = props;
  useCustomHeader({ title: '聯絡我們', navigation });
  const onClickCopy = () => {
    Clipboard.setString('support@inmeet.app');
    Toast.show('已複製support@inmeet.app');
  };
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.black1, flex: 1 }}>
      <View style={{ alignSelf: 'center', paddingTop: 80 }}>
        {mapIcon.contactIcon({ color: theme.colors.black4, size: 120 })}
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
        <BodyOne style={{ color: theme.colors.white, paddingRight: 5 }}>support@inmeet.app</BodyOne>
        <TouchableOpacity onPress={onClickCopy}>{mapIcon.copyIcon({ size: 20 })}</TouchableOpacity>
      </View>
      <View style={{ paddingTop: 30 }}>
        <BodyThree style={{ color: theme.colors.white, textAlign: 'center' }}>
          如有任何問題或意見，
        </BodyThree>
        <BodyThree style={{ color: theme.colors.white, textAlign: 'center' }}>
          請透過電子信箱聯絡我們。
        </BodyThree>
      </View>
    </SafeAreaView>
  );
}
