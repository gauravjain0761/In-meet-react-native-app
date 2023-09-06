import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useLayoutEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { Platform } from 'react-native';
import { BodyTwo } from '../components/common/Text';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
}));

export default function useCustomHeader({ title, navigation }: any) {
  const { theme } = useTheme();
  const styles = useStyles();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerLeft: props =>
        Platform.OS === 'android' ? null : (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
      headerTitle: props => {
        return <BodyTwo style={styles.headerTitle}>{title}</BodyTwo>;
      },
    });
  });
  return {};
}
