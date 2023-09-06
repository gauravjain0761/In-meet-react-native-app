import { View, Text, Image } from 'react-native';
import React from 'react';
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

const useStyles = makeStyles(theme => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
}));

export default function AccountSettings(props: ProfileStackScreenProps<'AccountSettings'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [collectionModal, setCollectionModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const handleConfirm = async () => {
    try {

      await setCollectionModal(false);
      await HttpClient.put(
        '/user/disable?disable=true',
        { disable: true },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      await dispatch(logoutUser()).unwrap();
    } catch (error) {}
    dispatch(patchUserToken(''));
    // await setCollectionModal(false);
    await logout();
  };
  const handleCancel = () => {
    setCollectionModal(false);
  };
  const handleOpen = () => {
    setCollectionModal(true);
  };
  const userId = useSelector(selectUserId);
  useCustomHeader({ title: '帳號設定', navigation });

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
      onPress: () => {
        handleOpen();
      },
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      {dataRow.map(item => (
        <ProfileRowItem
          key={item.title}
          title={item.title}
          titleStyle={item.titleStyle}
          rightIcon={item.rightIcon}
          onPress={item.onPress}
        />
      ))}
      <FastCommonModalComponent
        modalText="確定要刪除帳號嗎"
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </View>
  );
}
