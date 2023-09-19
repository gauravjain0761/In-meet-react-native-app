import { View, Text, Image } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import VIP from '../../assets/images/VIP.png';
import { fontSize } from '~/helpers/Fonts';
import { mapIcon } from '~/constants/IconsMapping';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'rgba(56, 58, 68, 0.90)',
    marginHorizontal: 30,
    borderRadius: 15,
    paddingVertical: 24,
    width: 150,
    height: 125,
    alignItems:'center'
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
}));

interface IConfirmModal {
  onClose?: () => void;
  isVisible?: boolean;
  onConfirmCallback?: () => void;
  textShow?: boolean;
}

export default function VerifiedModel(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback, textShow } = props;
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
      backdropOpacity={0}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {mapIcon.vectorIcon({size:48})}
          <Text
            style={{
              fontSize: fontSize(14),
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
              fontFamily: 'roboto',
              marginTop:10
            }}>
            您的檢舉已送出
          </Text>
        </View>
      </View>
    </ReactNativeModal>
  );
}
