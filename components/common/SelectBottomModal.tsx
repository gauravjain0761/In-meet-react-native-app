import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { BodyOne, CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import InforIcon from '../../assets/images/icons/InforIcon.png';
import { fontSize } from '~/helpers/Fonts';
const { width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardContainer: {
    width: width,
    borderRadius: 15,
    backgroundColor: "#262628",
    alignItems: 'center',
    bottom:-10,
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: '#0A84FF', textAlign: 'center' },
  diffText: { color: theme.colors?.black4, textAlign: 'center' },
  buttonStyle: {
    // height: 40,
    width: '80%',
  },
  textStyle: {
    fontSize: fontSize(14),
  },
}));

interface IConfirmModal {
  onClose?: () => void;
  isVisible?: boolean;
  onConfirmCallback?: () => void;
  onDeletePress?: () => void;
  onSecondBtn?: () => void;
}

export default function SelectBottomModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback, onDeletePress, onSecondBtn } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const handleClose = () => {
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
          <TouchableOpacity style={{ width: '100%' }} onPress={onDeletePress}>
            <BodyOne style={[styles.subTitleText, { marginVertical: 18, color: '#FF3B30' }]}>
              檢舉此動態
            </BodyOne>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              borderWidth: 0.7,
              width: '100%',
              borderColor: 'rgba(84, 84, 88, 0.65))',
            }}
          />
          <TouchableOpacity style={{ width: '100%' }} onPress={onClose}>
            <BodyOne style={[styles.subTitleText, { marginVertical: 18, color: '#0A84FF' }]}>
              取消
            </BodyOne>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
}
