import { View, Text, Modal, Dimensions, ModalProps } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BodyThree, CaptionFour, TitleOne } from './Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ButtonTypeOne, ButtonTypeTwo } from './Button';
import LandingProgressBar from './LandingProgressBar';

const { width, height } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  centeredView: {
    width: width - 60,
    height: '70%',
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  modalTitle: {
    textAlign: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  modalSubtitle: {
    paddingTop: 5,
    textAlign: 'center',
    color: theme.colors?.black3,
  },
  modalBody: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeCount: {
    color: theme.colors?.black3,
    paddingLeft: 12,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface IModal extends ModalProps {
  modalVisible: boolean;
  onCloseModal: () => void;
  modalTitle: string;
  modalSubtitle?: string;
  modalBodyTitle?: string;
  children: React.ReactNode;
  buttonTitle: string;
  button2Title: string;
  step: number;
  onConfirm: () => void;
}

export default function LandingModal({
  modalVisible,
  onCloseModal,
  modalTitle,
  children,
  animationType,
  transparent,
  buttonTitle,
  button2Title,
  modalSubtitle,
  modalBodyTitle,
  onConfirm,
  step,
  ...props
}: IModal) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Modal
      {...props}
      style={styles.centeredView}
      animationType={animationType}
      transparent={transparent}
      visible={modalVisible}
      onRequestClose={() => {
        onCloseModal();
      }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={[styles.modalWrapper, { height }]}>
          <View style={styles.centeredView}>
            {step !== 0 && <LandingProgressBar step={step} />}
            <TitleOne style={styles.modalTitle}>{modalTitle}</TitleOne>
            {modalSubtitle && <BodyThree style={styles.modalSubtitle}>{modalSubtitle}</BodyThree>}
            {modalBodyTitle && <BodyThree style={styles.modalSubtitle}>{modalBodyTitle}</BodyThree>}
            <View style={[styles.modalWrapper]}>{children}</View>

            {step !== 0 && (
              <>
                <CaptionFour
                  style={{ color: theme.colors.black1, textAlign: 'center', paddingTop: 10 }}>
                  獲得
                </CaptionFour>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 30,
                    paddingTop: 10,
                  }}>
                  {mapIcon.likeIcon({ color: theme.colors.pink, size: 40 })}
                  <TitleOne style={styles.likeCount}>x6</TitleOne>
                </View>
              </>
            )}

            <ButtonTypeTwo onPress={onConfirm} title={buttonTitle} />
            <ButtonTypeOne onPress={onCloseModal} title={button2Title} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
