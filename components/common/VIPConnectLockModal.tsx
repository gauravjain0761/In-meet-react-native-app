import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { BodyOne, BodyThree, CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import InforIcon from '../../assets/images/icons/user-clock-solid.png';
import { fontSize } from '~/helpers/Fonts';
const { width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  cardContainer: {
    width: width - 60,
    height: '42%',
    // alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    alignItems:'center',
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
    width: "80%",
  },
  textStyle: {
    fontSize: fontSize(14),
  },
}));

interface IConfirmModal {
  onClose?: () => void;
  isVisible?: boolean;
  onConfirmCallback?: () => void;
}

export default function VIPConnectLockModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirmCallback } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
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
          <Image source={InforIcon} style={{ width: 100, height: 100,marginTop:20 }} />
          <Text
            style={{
              fontSize: fontSize(18),
              fontWeight: '600',
              color: "#383A44",
              textAlign: 'center',
              marginVertical: 10,
              fontFamily:'roboto'
            }}>
            封鎖對方
          </Text>
          <BodyThree style={[styles.subTitleText, { marginBottom: 12 }]}>
            {"封鎖對方後將看不到您的個人資料，也\n不能聯絡您"}
          </BodyThree>
          <ButtonTypeTwo
            containerStyle={[styles.buttonStyle, { marginBottom: 10,marginTop:10 }]}
            buttonStyle={{height:40}}
            titleStyle={styles.textStyle}
            title="立刻加入"
            onPress={handleConfirm}
          />
          <UnChosenButton
            titleStyle={styles.textStyle}
            buttonStyle={{height:40}}
            containerStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            title="之後再說"
            onPress={handleClose}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}
