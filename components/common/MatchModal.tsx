import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { BodyOne, CaptionFour } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import InforIcon from '../../assets/images/icons/InforIcon.png';
import { fontSize } from '~/helpers/Fonts';
import Step1 from '~/assets/images/firstLogin/photos.png';
const { width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  cardContainer: {
    width: width - 30,
    height: '88%',
    // alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: theme.colors?.black1,
    alignItems:'center',
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: theme.colors?.white, textAlign: 'center' },
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
    width: "85%",
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

export default function MatchModal(props: IConfirmModal) {
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
          <Image source={Step1} style={{ width: 300, height: 380,marginTop:20 }} />
          <Text
            style={{
              fontSize: fontSize(18),
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
              marginVertical: 10,
              fontFamily: 'roboto',
              marginTop:40
            }}>
            升級VIP
          </Text>
          <CaptionFour style={[styles.subTitleText, { marginBottom: 50 }]}>
            {"限時24小時，抓緊時間開始聊天吧！"}
          </CaptionFour>
          <ButtonTypeTwo
            containerStyle={[styles.buttonStyle, { marginBottom: 10,marginTop:10 }]}
            buttonStyle={{height:50}}
            titleStyle={styles.textStyle}
            title="打招呼"
            onPress={handleConfirm}
          />
           <UnChosenButton
            titleStyle={styles.textStyle}
            buttonStyle={{ height: 50, backgroundColor: 'transparent' }}
            containerStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            // buttonStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
            title="繼續探索"
            onPress={handleClose}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}
