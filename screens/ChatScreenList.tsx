import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Menu } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { uniqueId } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { FormProvider, useForm } from 'react-hook-form';
import ReactNativeModal from 'react-native-modal';
import { RootTabScreenProps } from '../types';
import { mapIcon } from '../constants/IconsMapping';
import { BodyTwo, CaptionFour, SubTitleOne, SubTitleTwo } from '../components/common/Text';
import RoomCard from '../components/common/Card/RoomCard';
import CommonModalComponent from '../components/common/CommonModalComponent';
import { RootState, useAppDispatch } from '~/store';
import { getRoomList } from '~/store/roomSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
import { userApi } from '~/api/UserAPI';
import HelperRoomCard from '~/components/common/Card/HelperRoomCard';
import LandingModal from '~/components/common/LandingModal';
import InputField from '~/components/common/InputField';
import { ButtonTypeTwo, UnChosenButton } from '~/components/common/Button';
import Loader from '~/components/common/Loader';
import { fontSize } from '~/helpers/Fonts';
import ChatBottomModal from '~/components/common/ChatBottomModal';
import ReportCard from '~/components/common/Card/ReportCard';
import ReportModal from '~/components/common/ReportModal';
const { width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    marginLeft: 24,
  },

  emptyWrapper: {
    backgroundColor: theme.colors?.black1,
    height: '100%',
    paddingHorizontal: 90,
    paddingTop: width * 0.56,
    display: 'flex',
    alignItems: 'center',
  },
  emptyWrapperText: {
    color: theme.colors.black4,
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: 25,
    marginTop: 5,
    fontFamily: 'roboto',
  },
  buttonStyle: {
    // height: 40,
    width: 180,
  },
  footerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors?.black1,
    borderTopWidth: 1,
    borderColor: theme.colors.black2,
    paddingTop: 10,
    paddingBottom: 5,
  },
  titleProps:{
    color:theme.colors.white
  },
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf:'center'
  },
}));

export default function ChatScreenList(props: RootTabScreenProps<'Chat'>) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const methods = useForm({
    mode: 'onSubmit',
  });
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = methods;
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState(false);
  const [collectionModal, setCollectionModal] = React.useState(false);

  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const userId = useSelector(selectUserId) as number;
  const token = useSelector(selectToken);
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const { data: clientList, refetch: refetchHelper } = useQuery('fetchHelperRoom', () =>
    userApi.fetchMessageClientList({ token, userId }, {})
  );
  const { mutate: readAllRoom, isLoading: isReadAllLoading } = useMutation(userApi.readAllRoom, {
    onSuccess: (data) => {
      console.log(data);
      setLoading(false);
      const message = 'success';
    },
    onError: () => {
      setLoading(false);
      alert('there was an error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('fetchHelperRoom');
      queryClient.invalidateQueries('getRoomList');
    },
  });
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ['getRoomList'],
      (pageObject) => userApi.fetchUserRoomList({ token, userId }, pageObject),
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      }
    );
  useFocusEffect(
    useCallback(() => {
      const time = setInterval(() => {
        refetch();
        refetchHelper();
      }, 500);
      return () => {
        clearInterval(time);
      };
    }, [refetch, refetchHelper])
  );
  useEffect(() => {}, []);

  const helperRoom = clientList?.records || [];
  const rooms =
    data?.pages
      .map((page) => page.records)
      .flat()
      .filter((item) => !item.isSecret) || [];

  const roomsWithHelper = [...helperRoom, ...rooms];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '隱藏對話',
      headerLeft: (props) => {
        return (
          <TouchableOpacity onPress={navigation.goBack} style={{}}>
            {mapIcon.backIcon({ size: 28 })}
          </TouchableOpacity>
        );
      },
    });
  });

  const renderEmpty = () => {
    return (
      <View style={styles.emptyWrapper}>
        {mapIcon.emailIcon({ size: 140 })}
        <Text style={styles.emptyWrapperText}>無隱藏對話友</Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}>
        <TouchableOpacity
          onPress={() => {
            setFilterValue(!filterValue);
          }}>
          {filterValue ? mapIcon.checkIcon({ size: 20 }) : mapIcon.unCheckIcon({ size: 20 })}
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 0 }}>
          <ReportCard key={item.chatId || uniqueId()} roomData={item} />
        </View>
      </View>
    );
  };

  const handleCancel = () => {
    setCollectionModal(false);
  };

  const handleConfirm = async () => {
    setCollectionModal(false);
  }

  return (
    <Loader isLoading={loading}>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        {/* RoomCard */}
        <FlatList
          onEndReached={() => {
            // handleLoadMore();
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => item.id.toString()}
          data={roomsWithHelper}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        />
      </View>
      <View style={styles.footerStyle}>
        <UnChosenButton
           titleStyle={styles.titleProps}
          disabled={!filterValue? true : false}
          disabledStyle={{ backgroundColor: 'transparent' ,borderColor: theme.colors?.black3}}
          disabledTitleStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          buttonStyle={{ height: 40, backgroundColor: 'transparent' }}
          containerStyle={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
          title="刪除"
          onPress={()=> setCollectionModal(true)}
        />
        <ButtonTypeTwo
         disabled={!filterValue ? true : false}
         disabledStyle={{ backgroundColor: 'rgba(255, 78, 132, 0.5)' }}
         disabledTitleStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          containerStyle={[styles.buttonStyle, { marginBottom: 10, marginTop: 10 }]}
          buttonStyle={{ height: 40 }}
          title="解除隱藏"
        />
      </View>
      <ReportModal
        modalText={'刪除後無法再看到之前的聊天紀錄'}
        buttonOneTitle = '刪除'
        buttonTwoTitle = '取消'
        headerShow={true}
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        showCancel={true}
        headerShowText={'要刪除此對話嗎？'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={handleCancel}
      />
    </Loader>
  );
}
