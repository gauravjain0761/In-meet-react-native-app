import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { CaptionFive, CaptionFour, SubTitleTwo } from '../../../components/common/Text';
import { UnChosenButton } from '../../../components/common/Button';
import CommonModalComponent from '../../../components/common/CommonModalComponent';
import { userApi } from '~/api/UserAPI';
import { selectToken } from '~/store/userSlice';
import { calculateAge } from '~/helpers/convertDate';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { CITYEnum } from '~/constants/mappingValue';
import { UN_FILLED } from '~/constants/defaultValue';
import Loader from '~/components/common/Loader';

const useStyles = makeStyles(theme => ({
  image: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 60,
  },
  textStyle: {
    color: theme.colors?.white,
  },
  buttonStyle: {
    padding: 0,
    height: 30,
  },
  rowContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 16,
  },
}));

export default function BlockSetting(props: ProfileStackScreenProps<'BlockSetting'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const token = useSelector(selectToken);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const { data: blockList, isLoading } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token }),
  );
  const queryClient = useQueryClient();
  const [currentSelectedId, setCurrentSelectedId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const { mutate: removeBlockInfo, isLoading: isRemoveLoading } = useMutation(
    userApi.removeBlockInfo,
    {
      onSuccess: data => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('fetchUserBlockInfoList');
      },
    },
  );
  const handleConfirm = async () => {
    try {
      await removeBlockInfo({ token, id: currentSelectedId });
    } catch (error) {}
    setCollectionModal(false);
    setCurrentSelectedId('');
  };
  const handleCancel = () => {
    setCollectionModal(false);
    setCurrentSelectedId('');
  };
  const handleOpen = record => {
    // 刪除檢舉
    if (!record.id) return;
    setCollectionModal(true);
    setCurrentSelectedId(record.id);
    setCurrentName(record.user?.name);
  };
  useCustomHeader({ title: '已封鎖名單', navigation });
  return (
    <Loader isLoading={isRemoveLoading || isLoading}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        {blockList?.records.map(record => (
          <View style={styles.rowContainer} key={record.id}>
            <Image
              style={styles.image}
              source={record?.blockUser?.avatar ? { uri: record.blockUser.avatar } : defaultAvatar}
            />
            <View style={styles.bodyContainer}>
              <SubTitleTwo style={styles.textStyle}>{record.blockUser?.name || 'John'}</SubTitleTwo>
              <CaptionFour style={styles.textStyle}>
                {calculateAge(record.blockUser?.birthday)}{' '}
                {get(CITYEnum, record.blockUser?.city, UN_FILLED)}
              </CaptionFour>
            </View>
            <UnChosenButton
              onPress={() => handleOpen(record)}
              buttonStyle={styles.buttonStyle}
              title={<CaptionFive style={{ color: theme.colors.black4 }}>解除封鎖</CaptionFive>}
            />
          </View>
        ))}
        <CommonModalComponent
          modalText={`要將${currentName}解除封鎖嗎？`}
          isVisible={collectionModal}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      </ScrollView>
    </Loader>
  );
}
