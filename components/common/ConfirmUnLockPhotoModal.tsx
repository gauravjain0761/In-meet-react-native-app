import { View, Text } from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour, SubTitleTwo } from './Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserPoint, selectToken } from '~/store/userSlice';
import HttpClient from '~/axios/axios';
import { paymentApi, userApi } from '~/api/UserAPI';

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
    paddingVertical: 10,
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: theme.colors?.black3, textAlign: 'center' },
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
    paddingTop: 10,
  },
}));

interface IConfirmModal {
  onConfirm: () => void;
  onClose: () => void;
  isVisible: boolean;
  title: string;
}

export default function ConfirmUnLockPhotoModal(props: IConfirmModal) {
  const { isVisible, onClose, onConfirm, onPurchase, title } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const point = useSelector((state: RootState) => state.user.point);
  const token = useSelector(selectToken);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose();
  };
  const hasNoPoint = point < 3;

  const handleConfirm = async () => {
    if (hasNoPoint) {
      onPurchase();
      return;
    }
    try {
      // const res = await paymentApi.payPoint({ token, usedPoint: 1 });

      onConfirm();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={1200}
      backdropOpacity={0.5}
      isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <SubTitleTwo style={styles.titleText}>{title || '要查看私密照嗎?'}</SubTitleTwo>
          <CaptionFour style={styles.subTitleText}>將會消耗三顆愛心</CaptionFour>
          <View style={styles.likeIconContainer}>
            {mapIcon.likeIcon({ color: theme.colors.pink, size: 24 })}
          </View>

          <CaptionFour style={styles.diffText}>
            {hasNoPoint ? `${point}顆` : `${point}顆→${point - 3}顆`}
          </CaptionFour>

          <ButtonTypeTwo
            style={styles.buttonStyle}
            title={hasNoPoint ? '追加愛心' : '確定'}
            onPress={handleConfirm}
          />
          <UnChosenButton style={styles.buttonStyle} title="取消" onPress={handleClose} />
        </View>
      </View>
    </ReactNativeModal>
  );
}
