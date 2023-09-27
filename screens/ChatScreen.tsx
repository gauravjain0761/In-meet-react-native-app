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
const { width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    marginLeft: 24,
  },
  buttonStyle: {
    paddingTop: 10,
  },
  titleText: {
    color: theme.colors?.black1,
    paddingBottom: 15,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: theme.colors?.white,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  inputStyle: {
    shadowColor: 'black',
    backgroundColor: 'white',
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  moreStyle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.black3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
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
}));

export default function ChatScreen(props: RootTabScreenProps<'Chat'>) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const methods = useForm({
    mode: 'onSubmit',
  });
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = methods;
  const [loading, setLoading] = useState(false);
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

  const roomchat =  {
      chatId: '1_814',
      content: '謝謝您的體諒與支持， InMeet營運團隊感謝您',
      createTime: '2023-06-27 15:30:54',
      id: 992,
      isDelete: null,
      isFromClient: false,
      isSecret: false,
      notReadCount: 0,
      recipientAvatar:
        'https://inmeet-service.s3.ap-northeast-1.amazonaws.com/avatar/814/69efe54f-5d74-468f-b4a0-6a3a98152b6f.png',
      recipientId: 814,
      recipientName: '花生',
      senderAvatar:
        'https://inmeet-service.s3.ap-northeast-1.amazonaws.com/blog/4/58e83f9a-5952-4f73-9287-b5c7fad83614.JPG',
      senderId: 1,
      senderName: 'Chloe',
      status: 'DELIVERED',
      type: 'TEXT',
    }


  const roomsWithHelper = [...helperRoom,roomchat, ...rooms];

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    const password = data?.password;
    try {
      const res = await userApi.unHideRoomChat({ password, userId, token });
      if (res?.code !== 20000) {
        throw new Error('something went wrong');
      }
      queryClient.invalidateQueries('getRoomList');
    } catch (error) {
      Toast.show('失敗');
    }
    setValue('password', '');
    setLoading(false);
    setCollectionModal(false);
    setVisibleModal(false);
    setShowPassword(false);
  };

  const handleReadAll = async () => {
    closeMenu();
    setLoading(true);
    try {
      await readAllRoom({ token });
    } catch (error) {
      Toast.show('失敗');
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '',
      headerLeft: (props) => {
        return <SubTitleOne style={styles.headerTitle}>聊天</SubTitleOne>;
      },
      headerRight: (props) => {
        return (
          <TouchableOpacity
            onPress={() => {
              // setCollectionModal(true);
              setVisibleModal(true);
              setShowPassword(false);
            }}
            style={styles.moreStyle}>
            {mapIcon.more({ size: 20, color: theme.colors.black4 })}
          </TouchableOpacity>
        );
      },
    });
  }, []);

  const renderEmpty = () => {
    return (
      <View style={styles.emptyWrapper}>
        {/* <Image style={{ width: 180, height: 136, marginBottom: 4 }} source={Empty} /> */}
        {mapIcon.emailIcon({ size: 140 })}
        <Text style={styles.emptyWrapperText}>您尚未加好友</Text>
        <Text style={[styles.emptyWrapperText, { fontSize: fontSize(14), marginTop: 8 }]}>
          {'別擔心，快到MEET尋找志\n同道合的朋友吧！'}
        </Text>
      </View>
    );
  };

  return (
    <Loader isLoading={loading}>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        {roomsWithHelper?.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <SubTitleTwo style={{ color: theme.colors.black4 }}>您尚未加入好友</SubTitleTwo>
            <SubTitleTwo style={{ color: theme.colors.black4 }}>
              快到首頁尋找志同道合的朋友吧！
            </SubTitleTwo>
          </View>
        )}

        {/* <Menu
          contentStyle={{
            backgroundColor: theme.colors.black2,
            borderRadius: 20,
            paddingVertical: 0,
          }}
          visible={visible}
          onDismiss={closeMenu}
          anchor={{ x: width - 10, y: headerHeight }}>
          {isVIP && (
            <Menu.Item
              style={{
                height: 32,
                paddingHorizontal: 5,
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
              }}
              onPress={() => {
                closeMenu();
                setCollectionModal(true);
              }}
              title={
                <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                  恢復隱藏對話
                </CaptionFour>
              }
            />
          )}
          <Menu.Item
            style={{
              height: 32,
              borderBottomEndRadius: 20,
              paddingHorizontal: 5,
              borderBottomStartRadius: 20,
            }}
            onPress={() => handleReadAll()}
            title={
              <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                全部標為已讀
              </CaptionFour>
            }
          />
        </Menu> */}
        {/* RoomCard */}
        <FlatList
          onEndReached={() => {
            // handleLoadMore();
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => item?.id?.toString()}
          data={roomsWithHelper}
          ListEmptyComponent={renderEmpty}
          renderItem={({ index, item }: any) => {
            if (item.isFromClient) {
              return <HelperRoomCard key={item.chatId || uniqueId()} roomData={item} />;
            }
            return <RoomCard key={item.chatId || uniqueId()} roomData={item} />;
          }}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        />
        <ReactNativeModal
          animationInTiming={1000}
          animationOutTiming={1200}
          backdropOpacity={0.5}
          isVisible={collectionModal}>
          <FormProvider {...methods}>
            <View style={styles.cardContainer}>
              <SubTitleTwo style={styles.titleText}>請輸入密碼，解除隱藏對話</SubTitleTwo>

              <InputField
                name="password"
                placeholder="輸入密碼"
                textContentType="none"
                rules={{
                  required: '這是必填欄位',
                }}
                styles={{ width: '100%', ...styles.inputStyle, color: theme.colors.black }}
                secureTextEntry={!visiblePassword}
                onRightPress={() => setVisiblePassword(!visiblePassword)}
                right={mapIcon.invisiblePassword()}
              />

              <ButtonTypeTwo
                style={styles.buttonStyle}
                title="確定"
                onPress={handleSubmit(onSubmit)}
              />
              <UnChosenButton
                style={styles.buttonStyle}
                title="取消"
                onPress={() => setCollectionModal(false)}
              />
            </View>
          </FormProvider>
        </ReactNativeModal>
        <ChatBottomModal
          showPassword={showPassword}
          opnePassword={() => {
            setShowPassword(true);
          }}
          isVisible={visibleModal}
          methods={methods}
          onClose={() => {
            setVisibleModal(false);
            setShowPassword(false);
          }}
          onSubmitPress={handleSubmit(onSubmit)}
          onSecondPress={() => {
            setVisibleModal(false);
            navigation.push('ChatScreenList');
          }}
        />
      </View>
    </Loader>
  );
}
