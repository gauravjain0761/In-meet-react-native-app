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
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { mapIcon } from '~/constants/IconsMapping';
import ReportModal from '~/components/common/ReportModal';
import Toast from 'react-native-root-toast';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf:'center'
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
  const [reportModal, setReportModal] = useState(false);
  const [modalText, setModalText] = useState('已檢舉用戶');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
      headerTitle: '檢舉',
    });
  }, []);

  const reportTypes = [
    { title: '辱罵或威脅其他等騷擾行為', value: 'HARASS' },
    { title: '惡意騷擾/褻瀆行為', value: 'FAKE_INFO' },
    { title: '疑似詐騙/釣魚', value: 'FRAUD' },
    { title: '廣告/銷售', value: 'INAPPROPRIATE_PHOTOS' },
    { title: '包含非法/色情內容', value: 'NONAGE' },
    { title: '其他', value: 'OTHER' },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePressReport = async (item) => {
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
        })
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
      contentContainerStyle={{ marginTop: 70 }}
      style={{ backgroundColor: theme.colors.black1, flex: 1 }}>
      <CommonModalComponent
        modalText={"請放心，檢舉內容將匿名提交。"}
        headerShow={true}
        isVisible={collectionModal}
        onConfirm={handleGoBack}
        showCancel={true}
        headerShowText={"檢舉對方假冒的個人資料"}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={()=>{ setCollectionModal(false)}}
      />
      <ReportModal
        modalText={'請放心，檢舉內容將匿名提交。'}
        buttonOneTitle = '確定檢舉'
        buttonTwoTitle = '取消'
        headerShow={true}
        isVisible={reportModal}
        onConfirm={handleGoBack}
        showCancel={true}
        headerShowText={'假冒的個人資料'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={() => {
          setReportModal(false);
          Toast.show('已成功檢舉此動態');
        }}
      />
      {reportTypes.map((item,index) => (
        <ProfileRowItem
          key={item.value}
          title={item.title}
          titleStyle={{ color: theme.colors?.white, flex: 1 }}
          onPress={() => {
            index == 0 ? setReportModal(true) :
            setCollectionModal(true)
          }}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
