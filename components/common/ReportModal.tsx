import { View, Text } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import { fontSize } from '~/helpers/Fonts';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: theme.colors?.black1,
    marginHorizontal: 30,
    // width: '100%',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
  titleText: {
    color: theme.colors?.white,
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
export default function ReportModal(props: ICommonModal) {
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
      backdropColor={"rgba(0, 0, 0, 1)"}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
         {headerShow && <SubTitleTwo style={[styles.titleText,{fontWeight:'500',fontSize:fontSize(18)}]}>{headerShowText}</SubTitleTwo>}
          <SubTitleTwo style={[styles.titleText,{    paddingVertical: 15,fontSize:fontSize(14)}]}>{modalText}</SubTitleTwo>
          <ButtonTypeTwo
            style={styles.buttonStyle}
            title={buttonOneTitle}
            onPress={handleConfirmModal}
            buttonStyle={{ height: 45  }}
            containerStyle={chosenBtnStyle}
          />
          {showCancel && (
            <UnChosenButton
              containerStyle={unChosenBtnStyle}
              buttonStyle={{ height: 45, backgroundColor: 'transparent' }}

              style={[styles.buttonStyle]}
              title={buttonTwoTitle}
              onPress={handleCloseModal}
            />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
}
