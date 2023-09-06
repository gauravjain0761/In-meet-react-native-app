import { View, Text, Modal, Dimensions, ModalProps } from 'react-native';
import React, { useRef, useState } from 'react';
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
    height: '50%',
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 25,
    paddingBottom: 20,
    minHeight: 350,
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
  modalSubTitle: string;
  children: React.ReactNode;
  buttonTitle: string;
  button2Title: string;
  modalSubtitle?: string;
  modalBodyTitle?: string;
  step: number;
  onConfirm: () => void;
}

export default function BannerModal({
  modalVisible,
  onCloseModal,
  modalTitle,
  modalSubTitle,
  children,
  animationType,
  transparent,
  buttonTitle,
  button2Title,
  modalBodyTitle,
  onConfirm,
  ...props
}: IModal) {
  const styles = useStyles();
  const { theme } = useTheme();
  const testRef = useRef();
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
        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            console.log('height: ', height);
          }}
          style={[styles.modalWrapper, { height }]}>
          <View style={styles.centeredView}>
            <TitleOne style={styles.modalTitle}>{modalTitle}</TitleOne>
            <BodyThree style={styles.modalSubtitle}>{modalSubTitle}</BodyThree>
            {modalBodyTitle && <BodyThree style={styles.modalSubtitle}>{modalBodyTitle}</BodyThree>}
            <View style={[styles.modalWrapper]}>{children}</View>

            <ButtonTypeTwo onPress={onConfirm} title={buttonTitle} />
            <ButtonTypeOne onPress={onCloseModal} title={button2Title} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
