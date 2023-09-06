import { View, Text, Image } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import { SplashScreenProps } from '../types';
import { TitleOne } from '../components/common/Text';
import Logo from '../components/common/Logo';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: theme.colors?.white,
    paddingTop: 20,
  },
}));

export default function SplashScreen(props: SplashScreenProps) {
  const styles = useStyles(props);
  return (
    <View style={styles.container}>
      <Logo />
      <TitleOne style={styles.titleText}>InMeet</TitleOne>
    </View>
  );
}
