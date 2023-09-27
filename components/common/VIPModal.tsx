import { View, Text, Image } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import VIP from '../../assets/images/VIP.png';
import { fontSize } from '~/helpers/Fonts';

const useStyles = makeStyles((theme) => ({
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
    // height: 40,
    width: 168,
  },
  textStyle: {
    fontSize: fontSize(14),
  },
  titleTextStyle:{
    fontSize: fontSize(18),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'roboto',
  }
}));

interface IConfirmModal {
  onClose: () => void;
  isVisible: boolean;
  onConfirmCallback: () => void;
  textShow: boolean;
  titleText:string
}

export default function VIPModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback, textShow, titleText="升級VIP即可【封鎖用戶】" } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    onClose();
    onConfirmCallback();
    // navigation.navigate('PurchaseVIPScreen');
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
            style={styles.titleTextStyle}>
            升級VIP
          </Text>
          <CaptionFour style={[styles.subTitleText, { marginBottom: 27 }]}>
            {textShow ? titleText : "加入VIP將享受到{'\n'}更快速的配對體驗"}
          </CaptionFour>
          <ButtonTypeTwo
            containerStyle={[styles.buttonStyle, { marginBottom: 10, marginTop: 10 }]}
            buttonStyle={{ height: 40 }}
            titleStyle={styles.textStyle}
            title="立刻加入"
            onPress={handleConfirm}
          />
          <UnChosenButton
            titleStyle={styles.textStyle}
            buttonStyle={{ height: 40, backgroundColor: 'transparent' }}
            containerStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            // buttonStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            title="之後再說"
            onPress={handleClose}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}
