import { View, Text, Image } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import VIP from '../../assets/images/VIP.png';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#383A44',
    marginHorizontal: 30,
    borderRadius: 15,
    paddingVertical: 24,
    width: 262,
    height: 400,
    paddingHorizontal: 46,
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: theme.colors?.white, textAlign: 'center' },
  likeIconContainer: {
    marginTop: 15,
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 40,
    shadowColor: theme.colors?.black,
    backgroundColor: theme.colors?.white,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  diffText: { color: theme.colors?.black4, textAlign: 'center' },
  buttonStyle: {
    height: 40,
    width: 168,
  },
  textStyle: {
    fontSize: 14,
  },
}));

interface IConfirmModal {
  onClose: () => void;
  isVisible: boolean;
  onConfirmCallback: () => void;
}

export default function VIPModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    onClose();
    onConfirmCallback();
    navigation.navigate('PurchaseVIPScreen');
  };
  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={1200}
      backdropOpacity={0.5}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Image source={VIP} style={{ width: 160, height: 140 }} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
              marginVertical: 10,
            }}>
            升級VIP
          </Text>
          <CaptionFour style={[styles.subTitleText, { marginBottom: 27 }]}>
            加入VIP將享受到{'\n'}更快速的配對體驗
          </CaptionFour>
          <ButtonTypeTwo
            buttonStyle={[styles.buttonStyle, { marginBottom: 10 }]}
            titleStyle={styles.textStyle}
            title="立刻加入"
            onPress={handleConfirm}
          />
          <UnChosenButton
            titleStyle={styles.textStyle}
            buttonStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            title="之後再說"
            onPress={handleClose}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}
