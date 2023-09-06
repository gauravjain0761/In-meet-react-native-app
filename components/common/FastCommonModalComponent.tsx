import { View, Text } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: theme.colors?.white,
    marginHorizontal: 30,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  titleText: {
    color: theme.colors?.black1,
    paddingVertical: 15,
    textAlign: 'center',
  },
  buttonStyle: {
    paddingTop: 10,
  },
}));

interface ICommonModal {
  onClose?: () => void;
  onConfirm: () => void;
  isVisible: boolean;
  modalText?: string;
  showCancel?: boolean;
  buttonOneTitle?: string,
  buttonTwoTitle?: string,
}
export default function FastCommonModalComponent(props: ICommonModal) {//用CommonModalComponent out時如果會卡住就用這個
  const {
    onClose,
    isVisible,
    onConfirm,
    modalText = '要將 John 加入收藏嗎?',
    showCancel =  true,
    buttonOneTitle="確定",
    buttonTwoTitle="取消",
  } = props;
  const styles = useStyles();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleConfirmModal = () => {
    onConfirm();
  };
  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={10}
      backdropOpacity={0.5}
      animationOut={"fadeOutDown"}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <SubTitleTwo style={styles.titleText}>{modalText}</SubTitleTwo>

          <ButtonTypeTwo style={styles.buttonStyle} title={buttonOneTitle} onPress={handleConfirmModal} />
          {showCancel && (
            <UnChosenButton style={styles.buttonStyle} title={buttonTwoTitle} onPress={handleCloseModal} />
          )}
        </View> 
      </View>
    </ReactNativeModal>
  );
}

