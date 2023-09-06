import { View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

import useRequestLocation from '~/hooks/useRequestLocation';
import { BodyThree, SubTitleOne } from '~/components/common/Text';
import { mapIcon } from '~/constants/IconsMapping';
import { ButtonTypeTwo } from '~/components/common/Button';
import { LocationPermissionScreenProps } from '~/types';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bodyText: {
    color: theme.colors?.black4,
    paddingBottom: 30,
    textAlign: 'center',
  },

  footerContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 100,
    flexGrow: 1,
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
export default function LocationPermissionScreen(props: LocationPermissionScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const [openLocationAsync] = useRequestLocation();

  const onSubmit = async () => {
    try {
      const { latitude, longitude } = await openLocationAsync({});
      if (latitude && longitude) {
        navigation.goBack();
      }
    } catch (error) { }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          <BodyThree style={styles.bodyText}>
            為了使用 InMeet 你需要授予對裝置所在位置的存取權限
          </BodyThree>
          <View style={styles.imageContainer}>{mapIcon.locationLogo()}</View>
        </View>

        <View style={styles.footerContainer}>
          <ButtonTypeTwo
            title={<SubTitleOne style={styles.chosenButtonText}>開啟定位</SubTitleOne>}
            onPress={() => onSubmit()}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
