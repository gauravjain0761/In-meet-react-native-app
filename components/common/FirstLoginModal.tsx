import { View, Modal, Dimensions, ModalProps, Image } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { BodyThree } from './Text';
import { ButtonTypeOne, ButtonTypeTwo } from './Button';

import Illus1 from '~/assets/images/firstLogin/illus1.png';
import Illus2 from '~/assets/images/firstLogin/illus2.png';
import Step1 from '~/assets/images/firstLogin/photos.png';
import Step2 from '~/assets/images/firstLogin/unlimited.png';
import Step3 from '~/assets/images/firstLogin/world.png';
import Step4 from '~/assets/images/firstLogin/undraw_photos_re_pvh3.png';
import Step5 from '~/assets/images/firstLogin/vip.png';

const { width, height } = Dimensions.get('window');
const LAST_STEP = 4;
const useStyles = makeStyles(theme => ({
  centeredView: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#383A44',
    paddingHorizontal: 25,
    paddingBottom: 20,
    minHeight: 350,
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  modalSubtitle: {
    paddingTop: 5,
    textAlign: 'center',
    color: theme.colors?.white,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 28,
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
}

const MODAL_CONTENT = [
  {
    title: '找到你的完美配對',
    src: Step1,
    style: {
      width: 240,
      height: 295,
      marginBottom: 24,
    },
  },
  {
    title: '互相喜歡24小時暢聊無阻',
    src: Step2,
    style: {
      width: 267,
      height: 210,
      marginBottom: 66,
    },
  },
  {
    title: '探索附近新朋友',
    src: Step3,
    style: {
      width: 267,
      height: 199,
      marginBottom: 69,
    },
  },
  {
    title: '分享你的生活點滴',
    src: Step4,
    style: {
      width: 222,
      height: 191,
      marginBottom: 76,
    },
  },
  {
    title: '升級VIP暢聊不受限',
    src: Step5,
    style: {
      width: 234,
      height: 204,
      marginBottom: 68,
    },
  },
];

export default function FirstLoginModal({
  modalVisible,
  onCloseModal,
  animationType,
  transparent,
  ...props
}: IModal) {
  const styles = useStyles();
  const [step, setStep] = useState(0);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const onNext = () => {
    if (step !== LAST_STEP) {
      setStep(prev => prev + 1);
    } else {
      onCloseModal();
    }
  };
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
            <Image
              source={Illus1}
              style={{ width: 254, height: 155, position: 'absolute', top: 0, left: -45 }}
            />
            <Image
              source={Illus2}
              style={{
                width: 332,
                height: 203,
                position: 'absolute',
                top: 8.5,
                left: 88.4,
              }}
            />
            <View
              style={{
                height: 400,
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
              <Image source={MODAL_CONTENT[step].src} style={MODAL_CONTENT[step].style} />
            </View>
            <BodyThree style={styles.modalSubtitle}>{MODAL_CONTENT[step].title}</BodyThree>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {Array.from(Array(5)).map((_e, i) => (
                <View
                  key={i}
                  style={{
                    width: step === i ? 12 : 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: step === i ? '#fff' : theme.colors.black3,
                    marginLeft: i === 0 ? 0 : 6,
                    marginBottom: 24,
                  }}
                />
              ))}
            </View>
            <ButtonTypeTwo
              onPress={onNext}
              title={step !== LAST_STEP ? '下一步' : '開始探索'}
              style={{ width: 295, height: 50 }}
            />
            {step === 4 && (
              <ButtonTypeOne
                onPress={() => {
                  onCloseModal();
                  navigation.navigate('PurchaseVIPScreen');
                }}
                title="升級 VIP"
                buttonStyle={{
                  backgroundColor: '#FFEBEF',
                  borderWidth: 1.5,
                  borderColor: '#FF4E84',
                  width: 295,
                  height: 50,
                  marginTop: 24,
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
