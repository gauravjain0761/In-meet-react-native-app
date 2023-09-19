import { View, Text } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';

const useStyles = makeStyles((theme) => ({
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
  buttonOneTitle?: string;
  buttonTwoTitle?: string;
  unChosenBtnStyle?: any;
  headerShowText?: any;
  headerShow?: any;
  chosenBtnStyle?: any;
}
export default function CommonModalComponent(props: ICommonModal) {
  const {
    onClose,
    isVisible,
    onConfirm,
    modalText = '要將 John 加入收藏嗎?',
    showCancel = true,
    buttonOneTitle = '確定',
    buttonTwoTitle = '取消',
    unChosenBtnStyle,
    headerShowText,
    headerShow,
    chosenBtnStyle
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
      animationOutTiming={1200}
      backdropOpacity={0.5}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
         {headerShow && <SubTitleTwo style={[styles.titleText,{fontWeight:'500'}]}>{headerShowText}</SubTitleTwo>}
          <SubTitleTwo style={[styles.titleText,{    paddingVertical: 15,}]}>{modalText}</SubTitleTwo>
          <ButtonTypeTwo
            style={styles.buttonStyle}
            title={buttonOneTitle}
            onPress={handleConfirmModal}
            buttonStyle={{ height: 48,  }}
            containerStyle={chosenBtnStyle}
          />
          {showCancel && (
            <UnChosenButton
              containerStyle={unChosenBtnStyle}
              style={[styles.buttonStyle]}
              title={buttonTwoTitle}
              onPress={handleCloseModal}
              buttonStyle={{ height: 48,  }}
            />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
}
