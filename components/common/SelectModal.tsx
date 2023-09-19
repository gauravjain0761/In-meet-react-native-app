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
    width: width - 20,
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    alignItems: 'center',
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

export default function SelectModal(props: IConfirmModal) {
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
              檢舉此用戶
            </BodyOne>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              borderWidth: 1,
              width: '100%',
              borderColor: 'rgba(60, 60, 67, 0.30)',
            }}
          />
          <TouchableOpacity style={{ width: '100%' }} onPress={onSecondBtn}>
            <BodyOne style={[styles.subTitleText, { marginVertical: 18, color: '#383838' }]}>
              封鎖此用戶
            </BodyOne>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.cardContainer, { marginTop: 5 }]} onPress={handleClose}>
          <BodyOne
            style={[
              styles.subTitleText,
              { marginVertical: 18, color: '#383838', fontWeight: '700' },
            ]}>
            取消
          </BodyOne>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
}
