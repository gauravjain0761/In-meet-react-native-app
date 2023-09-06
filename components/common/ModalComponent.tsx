import { View, Text, Modal, Dimensions, ModalProps } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { BodyThree, TitleOne } from './Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ButtonTypeTwo } from './Button';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  centeredView: {
    width: width - 60,
    height: '50%',
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  modalTitle: {
    textAlign: 'center',
    paddingTop: 50,
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
  modalSubtitle: string;
  children: React.ReactNode;
  buttonTitle: string;
}

export default function ModalComponent({
  modalVisible,
  onCloseModal,
  modalSubtitle,
  modalTitle,
  children,
  animationType,
  transparent,
  buttonTitle,
  ...props
}: IModal) {
  const styles = useStyles();
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
      <View style={styles.modalWrapper}>
        <View style={styles.centeredView}>
          <TitleOne style={styles.modalTitle}>{modalTitle}</TitleOne>
          <BodyThree style={styles.modalSubtitle}>{modalSubtitle}</BodyThree>
          {children && <View style={styles.modalBody}>{children}</View>}
          <ButtonTypeTwo onPress={onCloseModal} title={buttonTitle} />
        </View>
      </View>
    </Modal>
  );
}
