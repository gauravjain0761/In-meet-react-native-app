import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { BodyTwo } from '../../components/common/Text';
import { RootStackScreenProps } from '../../types';

import ProfileRowItem from '~/components/Profile/ProfileRowItem';
import { useAppDispatch } from '~/store';
import { reportForumPost } from '~/store/forumSlice';
import { selectUserId } from '~/store/userSlice';
import CommonModalComponent from '~/components/common/CommonModalComponent';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
}));

export default function ReportScreen(props: RootStackScreenProps<'ReportScreen'>) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const [collectionModal, setCollectionModal] = useState(false);
  const [modalText, setModalText] = useState('已檢舉用戶');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return <BodyTwo style={styles.headerTitle}>檢舉</BodyTwo>;
      },
    });
  });

  const reportTypes = [
    { title: '假冒的個人資料', value: 'FAKE_INFO' },
    { title: '辱罵或威脅其他等騷擾行為', value: 'HARASS' },
    { title: '從事詐騙或援交', value: 'FRAUD' },
    { title: '不當的個人照片', value: 'INAPPROPRIATE_PHOTOS' },
    { title: '未成年使用者', value: 'NONAGE' },
    { title: '其他', value: 'OTHER' },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePressReport = async item => {
    const resourceId = get(route, 'params.id', '');
    const blockReportType = get(route, 'params.blockReportType', '');
    const { value: blockReason, title } = item;
    try {
      if (!blockReason || !resourceId || !userId) return;
      const res = await dispatch(
        reportForumPost({
          resourceId,
          blockReportType,
          blockReason,
          reportUserId: userId,
        }),
      ).unwrap();
      setModalText(`已檢舉用戶\n「${title}」`);
      if (res?.success) {
        setCollectionModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: bottom }}
      style={{ backgroundColor: theme.colors.black1, paddingBottom: 10 }}>
      <CommonModalComponent
        modalText={modalText}
        isVisible={collectionModal}
        onConfirm={handleGoBack}
        showCancel={false}
      />
      {reportTypes.map(item => (
        <ProfileRowItem
          key={item.value}
          title={item.title}
          titleStyle={{ color: theme.colors?.white, flex: 1 }}
          onPress={() => handlePressReport(item)}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
