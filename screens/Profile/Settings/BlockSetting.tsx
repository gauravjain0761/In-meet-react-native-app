import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { BodyTwo, CaptionFive, CaptionFour, SubTitleTwo } from '../../../components/common/Text';
import { UnChosenButton } from '../../../components/common/Button';
import CommonModalComponent from '../../../components/common/CommonModalComponent';
import { userApi } from '~/api/UserAPI';
import { selectToken } from '~/store/userSlice';
import { calculateAge } from '~/helpers/convertDate';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { CITYEnum } from '~/constants/mappingValue';
import { UN_FILLED } from '~/constants/defaultValue';
import Loader from '~/components/common/Loader';
import { mapIcon } from '~/constants/IconsMapping';
import { useHeaderHeight } from '@react-navigation/elements';
import ReportModal from '~/components/common/ReportModal';

const useStyles = makeStyles((theme) => ({
  image: {
    width: 48,
    aspectRatio: 1,
    borderRadius: 48,
  },
  textStyle: {
    color: theme.colors?.white,
  },
  buttonStyle: {
    padding: 0,
    height: 30,
    backgroundColor: '#88898F',
  },
  rowContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingBottom: 16,
    paddingVertical: 12,
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf:'center'
  },
}));

export default function BlockSetting(props: ProfileStackScreenProps<'BlockSetting'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();

  const token = useSelector(selectToken);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const { data: blockList, isLoading } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token })
  );
  const queryClient = useQueryClient();
  const [currentSelectedId, setCurrentSelectedId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const { mutate: removeBlockInfo, isLoading: isRemoveLoading } = useMutation(
    userApi.removeBlockInfo,
    {
      onSuccess: (data) => {
        const message = 'success';
      },
      onError: () => {
        // alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('fetchUserBlockInfoList');
      },
    }
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
  const handleOpen = (record) => {
    // 刪除檢舉
    // if (!record.id) return;
    setCollectionModal(true);
    // setCurrentSelectedId(record.id);
    // setCurrentName(record.user?.name);
  };
  // useCustomHeader({ title: '已封鎖名單', navigation });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '已封鎖名單',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });

  return (
    <Loader isLoading={isRemoveLoading || isLoading}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: headerHeight }}>
        {blockList?.records?.map(record => (
          <>
            <View style={styles.rowContainer} key={record.id}>
              <Image
                style={styles.image}
                source={
                  record?.blockUser?.avatar ? { uri: record.blockUser.avatar } : defaultAvatar
                }
              />
              <View style={styles.bodyContainer}>
                <SubTitleTwo style={styles.textStyle}>
                  {record?.blockUser?.name || 'John'}
                </SubTitleTwo>
                <CaptionFour style={[styles.textStyle, { marginTop: 3 }]}>
                  {calculateAge(record.blockUser?.birthday)}{' '} {get(CITYEnum, record?.blockUser?.city, UN_FILLED)}
                </CaptionFour>
              </View>
              <TouchableOpacity
                onPress={() => handleOpen(record)}
                style={{ paddingHorizontal: 18, paddingVertical: 6, backgroundColor: '#88898F',borderRadius:12 }}>
                <BodyTwo style={{ color: theme.colors.white }}>解除</BodyTwo>
              </TouchableOpacity>
              {/* <UnChosenButton
                onPress={() => handleOpen(record)}
                buttonStyle={styles.buttonStyle}
                title={<CaptionFive style={{ color: theme.colors.black4 }}>解除</CaptionFive>}
              /> */}
            </View>
            <View
              style={{
                marginLeft: 90,
                height: 1,
                width: '72%',
                borderWidth: 0.5,
                borderColor: theme.colors.black2,
              }}
            />
          </>
        ))}
        {/* <CommonModalComponent
          modalText={`要將${currentName}解除封鎖嗎？`}
          isVisible={collectionModal}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        /> */}
         <ReportModal
        modalText={`要將${currentName}解除封鎖嗎？`}
        buttonOneTitle = '刪除'
        buttonTwoTitle = '取消'
        headerShow={true}
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        showCancel={true}
        headerShowText={'解除封鎖'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={handleCancel}
      />
      </ScrollView>
    </Loader>
  );
}
