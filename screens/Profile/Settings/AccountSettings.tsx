import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { CaptionFive, CaptionFour, SubTitleTwo } from '../../../components/common/Text';
import { UnChosenButton } from '../../../components/common/Button';
import FastCommonModalComponent from '../../../components/common/FastCommonModalComponent';
import ProfileRowItem from '~/components/Profile/ProfileRowItem';
import { logoutUser, patchUserToken, selectToken, selectUserId } from '~/store/userSlice';
import { logout } from '~/storage/userToken';
import { useAppDispatch } from '~/store';
import HttpClient from '~/axios/axios';
import { sleep } from 'react-query/types/core/utils';
import { mapIcon } from '~/constants/IconsMapping';
import { useHeaderHeight } from '@react-navigation/elements';
import ReportModal from '~/components/common/ReportModal';
import Toast from 'react-native-root-toast';
import ChatBottomModal from '~/components/common/ChatBottomModal';
import AccountBottomModal from '~/components/common/AccountBottomModal';

const useStyles = makeStyles((theme) => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  footerContainer: {
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: theme.colors.black2,
  },
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf: 'center',
  },
}));

export default function AccountSettings(props: ProfileStackScreenProps<'AccountSettings'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [collectionModal, setCollectionModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const headerHeight = useHeaderHeight();
  const [reportModal, setReportModal] = useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false);

  const handleConfirm = async () => {
    setTimeout(() => {
      setVisibleModal(true);
    }, 1000);
    setReportModal(false);
  };

  const handleDone = async () => {
    try {
      await setReportModal(false);
      await setVisibleModal(false);
      await HttpClient.put(
        '/user/disable?disable=true',
        { disable: true },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      await dispatch(logoutUser()).unwrap();
    } catch (error) {}
    dispatch(patchUserToken(''));
    // await setCollectionModal(false);
    await logout();
  };

  const handleCancel = () => {
    setReportModal(false);
    Toast.show('已成功檢舉此動態');
  };
  const handleOpen = () => {
    setReportModal(true);
  };
  const userId = useSelector(selectUserId);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '帳號設定',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });
  const dataRow = [
    {
      title: '帳號ID',
      titleStyle: styles.defaultTitle,
      rightIcon: (
        <SubTitleTwo style={[styles.defaultTitle, { textAlign: 'right' }]}>{userId}</SubTitleTwo>
      ),
      onPress: () => {},
    },
    {
      title: '刪除帳號',
      titleStyle: styles.title,
      rightIcon: mapIcon.arrowDownIcon({ size: 20 }),
      onPress: () => {
        handleOpen();
      },
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: headerHeight - 10 }}>
      <View style={styles.footerContainer}>
        {dataRow.map((item) => (
          <ProfileRowItem
            key={item.title}
            title={item.title}
            titleStyle={item.titleStyle}
            rightIcon={item.rightIcon}
            onPress={item.onPress}
          />
        ))}
      </View>
      {/* <FastCommonModalComponent
        modalText="確定要刪除帳號嗎"
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      /> */}
      <ReportModal
        modalText={'確定要刪除帳號嗎？'}
        buttonOneTitle="確定"
        buttonTwoTitle="取消"
        headerShow={true}
        isVisible={reportModal}
        onConfirm={handleConfirm}
        onClose={handleCancel}
        showCancel={true}
        headerShowText={'刪除帳號'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
      />
      <AccountBottomModal
        showPassword={true}
        isVisible={visibleModal}
        onClose={() => {
          setVisibleModal(false);
        }}
        onSubmitPress={() => {
          handleDone();
        }}
        onSecondPress={() => {
          setVisibleModal(false);
          // navigation.push('ChatScreenList');
        }}
      />
    </View>
  );
}
