import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { BodyOne, CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import InforIcon from '../../assets/images/icons/InforIcon.png';
import { fontSize } from '~/helpers/Fonts';
const { width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  cardContainer: {
    width: width - 60,
    height: '42%',
    // alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    alignItems:'center',
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: theme.colors?.black1, textAlign: 'center' },
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
    width: "80%",
  },
  textStyle: {
    fontSize: fontSize(14),
  },
}));

interface IConfirmModal {
  onClose?: () => void;
  isVisible?: boolean;
  onConfirmCallback?: () => void;
}

export default function VIPConnectModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    onClose();
  };
  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={1200}
      backdropOpacity={0.5}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Image source={InforIcon} style={{ width: 150, height: 115,marginTop:20 }} />
          <BodyOne style={[styles.subTitleText, { marginVertical:30 }]}>
          加入 VIP 即可無限次反悔
          </BodyOne>
          <ButtonTypeTwo
            containerStyle={[styles.buttonStyle, { marginBottom: 10,marginTop:10 }]}
            buttonStyle={{height:40}}
            titleStyle={styles.textStyle}
            title="立刻加入"
            onPress={handleConfirm}
          />
          <UnChosenButton
            titleStyle={styles.textStyle}
            buttonStyle={{height:40}}
            containerStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            title="之後再說"
            onPress={handleClose}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}
