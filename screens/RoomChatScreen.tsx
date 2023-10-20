import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Menu } from 'react-native-paper';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import { Button, Icon } from '@rneui/base';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { get, isEmpty, lowerFirst, set, uniqueId } from 'lodash';
import { Client, Message, StompConfig } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { Row, Col } from 'react-native-responsive-grid-system';
import Toast from 'react-native-root-toast';
import { isSameDay, parse } from 'date-fns';
import { RootStackScreenProps } from '../types';
import { mapIcon } from '../constants/IconsMapping';
import { BodyOne, BodyThree, BodyTwo, CaptionFive, CaptionFour } from '../components/common/Text';
import { RootState, useAppDispatch } from '~/store';
import { getRoomMessage, selectRecipientId } from '~/store/roomSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
// import {PurchaseVIPScreen}from '~/Profile/PurchaseVIPScreen'
import { userApi } from '~/api/UserAPI';
import useKeyboardHeight from '~/hooks/useKeyboardHeight';
import { convertTime, convertToMMDD } from '~/helpers/convertDate';
import useUploadFile from '~/hooks/useUploadFile';
import { UN_KNOWN } from '~/constants/defaultValue';
import defaultAvatar from '~/assets/images/icons/profile.png';
import HttpClient from '~/axios/axios';
import CommonModalComponent from '~/components/common/CommonModalComponent';
import { updateCurrentMatchingId } from '~/store/interestSlice';
import { fontSize } from '~/helpers/Fonts';
import moment from 'moment';
import RoomChatBottomModal from '~/components/common/RoomChatBottomModal';
import ReportModal from '~/components/common/ReportModal';
import VIPModal from '~/components/common/VIPModal';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    paddingLeft: 10,
    fontSize: fontSize(18),
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: theme.colors.green,
    marginLeft: 5,
    marginTop: 4,
  },
  selectedImagesContainer: {
    backgroundColor: theme.colors?.black1,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  selectedImageContainer: {
    paddingRight: 10,
    paddingVertical: 10,
  },
  selectedImage: {
    width: 100,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  messageBubbleContainer: {
    paddingBottom: 15,
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  deleteIcon: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: 16,
    height: 16,
    position: 'absolute',
    right: 0,
  },
  timeText: {
    color: theme.colors.white,
    textAlign: 'center',
    // paddingBottom: 20,
    paddingHorizontal: 10,
  },
  lineDateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  divLineStyle: {
    width: 100,
    height: 1,
    borderWidth: 0.5,
    borderColor: theme.colors.black2,
  },
  moreStyle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.black3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerStyle: {
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black1,
    borderTopWidth: 1,
    paddingTop: 14,
    paddingBottom: 20,
    borderColor: theme.colors.black2,
  },
  inputStyle: {
    color: theme.colors.white,
    fontSize: fontSize(14),
    fontWeight: '300',
    fontFamily: 'roboto',
    maxHeight: 100,
    minHeight: 20,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: theme.colors.black2,
    paddingVertical: 6,
    paddingHorizontal: 14,
    paddingRight: 30,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  sendBtnStyle: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  headerTextStyle: {
    color: theme.colors?.white,
    fontSize: fontSize(12),
    textAlign: 'center',
  },
  headerViewStyle: {
    backgroundColor: theme.colors.black2,
    paddingVertical: 4,
    marginTop: 8,
  },
  chatButtonText: {
    fontSize: fontSize(14),
    color: theme.colors.white,
  },
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf: 'center',
  },
  footerText: {
    color: theme.colors.white,
  },
  vipText: {
    color: theme.colors.white,
    fontSize: fontSize(14),
    fontFamily: 'roboto',
  },
  vipBtnStyle: {
    width: 70,
    height: 40,
    backgroundColor: theme.colors.pink,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
}));

function ChatBubble(props) {
  const { isMine, image, id, msg, time, type } = props.data.item;
  const { isPrevSame } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  if (type === 'IMAGE') {
    if (isMine) {
      return (
        <View style={[styles.messageBubbleContainer, { justifyContent: 'flex-end' }]}>
          <View
            style={[
              {
                flexDirection: 'row',
              },
            ]}>
            {/* <View style={{ alignSelf: 'flex-end', paddingRight: 6 }}>
              <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
            </View> */}
            <View
              style={{
                backgroundColor: theme.colors.pink,
                maxWidth: 150,
                borderRadius: 10,
                // padding: 7,
              }}>
              <Row>
                {msg.split(',').map((item) => (
                  <Col key={item} xs={12} sm={12} md={12} lg={12}>
                    <Image
                      style={{ width: '100%', aspectRatio: 1, borderRadius: 10 }}
                      source={{ uri: item }}
                    />
                  </Col>
                ))}
              </Row>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.messageBubbleContainer}>
        {!isPrevSame && (
          <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={{ uri: image }} />
        )}
        <View
          style={[
            {
              flexDirection: 'row',
            },
          ]}>
          <View
            style={{
              backgroundColor: 'white',
              maxWidth: 140,
              marginLeft: !isPrevSame ? 10 : 50,
              borderRadius: 10,
              // padding: 7,
            }}>
            <Row>
              {msg.split(',').map((item) => (
                <Col key={item} xs={12} sm={12} md={12} lg={12}>
                  <Image
                    style={{ width: '100%', aspectRatio: 1, borderRadius: 10 }}
                    source={{ uri: item }}
                  />
                </Col>
              ))}
            </Row>
          </View>
          {/* <View style={{ alignSelf: 'flex-end', paddingLeft: 6 }}>
            <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
          </View> */}
        </View>
      </View>
    );
  }
  if (type == 'BOTH') {
    return (
      <View style={[styles.messageBubbleContainer, {}]}>
        <View
          style={[
            {
              backgroundColor: theme.colors.black2,
              maxWidth: 150,
              borderRadius: 10,
            },
          ]}>
          <View
            style={{
              backgroundColor: theme.colors.pink,
              maxWidth: 150,
              borderRadius: 10,
              // padding: 7,
            }}>
            <Row>
              {msg.split(',').map((item) => (
                <Col key={item} xs={12} sm={12} md={12} lg={12}>
                  <Image
                    style={{ width: '100%', aspectRatio: 1, borderRadius: 10 }}
                    source={{ uri: item }}
                  />
                </Col>
              ))}
            </Row>
          </View>
          <BodyThree
            selectable={true}
            style={[
              styles.chatButtonText,
              {
                fontSize: fontSize(12),
                textAlign: 'center',
                marginVertical: 8,
                marginHorizontal: 8,
              },
            ]}>
            {'路跑美乞條追，斤升支杯語帶左蛋戶包呀送'}
          </BodyThree>
          <View
            style={{
              alignSelf: 'flex-end',
              marginHorizontal: 15,
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {mapIcon.unlikeIcon({ size: 20 })}
            <BodyThree
              selectable={true}
              style={[
                styles.chatButtonText,
                { fontSize: fontSize(12), textAlign: 'center', marginLeft: 5 },
              ]}>
              {'20'}
            </BodyThree>
          </View>
        </View>
      </View>
    );
  }
  if (isMine) {
    return (
      <View style={[styles.messageBubbleContainer, { justifyContent: 'flex-end' }]}>
        <View
          style={[
            {
              flexDirection: 'row',
            },
          ]}>
          {/* <View style={{ alignSelf: 'flex-end', paddingRight: 6 }}>
            <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
          </View> */}
          <View
            style={{
              backgroundColor: '#FF4E8480',
              maxWidth: 260,
              borderRadius: 18,
              borderBottomRightRadius: 0,
              padding: 12,
            }}>
            <BodyThree style={[{ color: theme.colors.white }]} selectable={true}>
              {msg}
            </BodyThree>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.messageBubbleContainer}>
      {!isPrevSame && (
        <Image
          style={{ width: 36, height: 36, borderRadius: 36 }}
          source={image ? { uri: image } : defaultAvatar}
        />
      )}
      <View
        style={[
          {
            flexDirection: 'row',
          },
        ]}>
        <View
          style={{
            backgroundColor: theme.colors.black2,
            maxWidth: 260,
            marginLeft: !isPrevSame ? 10 : 50,
            borderRadius: 18,
            borderTopLeftRadius: 0,
            justifyContent: 'center',
            padding: 12,
          }}>
          <BodyThree selectable={true} style={styles.chatButtonText}>
            {msg}
          </BodyThree>
        </View>
        {/* <View style={{ alignSelf: 'flex-end', paddingLeft: 6 }}>
          <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
        </View> */}
      </View>
    </View>
  );
}

interface IPhoto {
  name: string;
  type: string;
  uri: string;
}

// 小幫手

const enum MessageType {
  'TEXT' = 0,
  'IMAGE' = 1,
  'FILE' = 2,
}

const useStompClient = () => {
  const userId = useSelector(selectUserId);
  const recipientId = useSelector(selectRecipientId);
  const chatId = `${userId}_${recipientId}`;
  const { uploadPhoto } = useUploadFile();
  const stompClientRef = useRef<Client>();

  const handleSendWebSocket = async ({
    content,
    photos,
    type,
  }: {
    content?: string;
    photos?: Array<any>;
    type: MessageType;
  }) => {
    if (stompClientRef.current) {
      if (type === MessageType.IMAGE) {
        const photoContents = await uploadPhoto(photos);
        stompClientRef.current.publish({
          destination: `/app/chat`,
          body: JSON.stringify({ senderId: userId, recipientId, content: photoContents, type }),
        });
        return;
      }

      stompClientRef.current.publish({
        destination: `/app/chat`,
        body: JSON.stringify({ senderId: userId, recipientId, content, type }),
      });
    }
  };

  const queryClient = useQueryClient();

  const connectToWS = () => {
    if (stompClientRef.current) {
      stompClientRef.current.activate();
    }
  };

  const disConnectToWS = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  useEffect(() => {
    let sub1;
    let sub2;
    const stompConfig: StompConfig = {
      connectHeaders: {},
      brokerURL: 'wss://uat.inmeet.vip/ws',
      debug(debug) {
        console.log('debug: ', debug);
      },
      reconnectDelay: 2000,
      onConnect(frame) {
        sub1 = stompClientRef.current!.subscribe(
          `/user/${userId}/queue/messages`,
          function (message) {
            console.log('message', JSON.parse(message.body));
            const data = JSON.parse(message.body);
            queryClient.refetchQueries(['fetchMessagesList', chatId], {
              refetchPage: (lastPage, index) => index === 0,
            });
            queryClient.invalidateQueries(['getRoomList']);
          }
        );
        sub2 = stompClientRef.current!.subscribe(
          `/user/${recipientId}/queue/messages`,
          function (message) {
            console.log('message', JSON.parse(message.body));
            const data = JSON.parse(message.body);
            queryClient.refetchQueries(['fetchMessagesList', chatId], {
              refetchPage: (lastPage, index) => index === 0,
            });
            queryClient.invalidateQueries(['getRoomList']);
          }
        );
      },
      onDisconnect(frame) {
        console.log('ondisconnect');
      },
      onStompError(frame) {
        console.log('Additional details', +frame.body);
      },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    };
    stompClientRef.current = new Client(stompConfig);
    connectToWS();

    return () => {
      if (sub1) {
        sub1.unsubscribe();
        sub1 = undefined;
      }
      if (sub2) {
        sub2.unsubscribe();
        sub2 = undefined;
      }
      disConnectToWS();
    };
  }, []);

  return {
    connectToWS,
    disConnectToWS,
    handleSendWebSocket,
  };
};

export default function RoomChatScreen(props: RootStackScreenProps<'RoomChatScreen'>) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [bottomHeight, setBottomHeight] = useState(0);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [blockChat, setBlockChat] = React.useState(false);
  const [remainTime, setRemainTime] = React.useState(false);
  const [remainTimeValue, setRemainTimeValue] = React.useState(0);

  const { handleSendWebSocket } = useStompClient();
  const openMenu = () => setVisible(true);
  const userId = useSelector(selectUserId);
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const routeRecipientId = get(route, 'params.recipientId', '');
  const routeVip = true;
  const queryClient = useQueryClient();

  const storeRecipientId = useSelector(selectRecipientId);
  const recipientId = routeRecipientId || storeRecipientId;
  if (recipientId === 0) {
    navigation.goBack();
  }
  const chatId = `${userId}_${recipientId}`;

  const token = useSelector(selectToken);
  const dispatch = useAppDispatch();
  const { data: recipientUserInfo } = useQuery(['fetchProfilePhotos', recipientId], () =>
    userApi.fetchUserInfoById({ token, id: recipientId })
  );

  const { data: blockList } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token })
  );
  const isBlocked = blockList?.records.map((record) => record.blockUser.id).includes(recipientId);
  const isBlockedId = isBlocked
    ? blockList?.records.filter((record) => record.blockUser.id === recipientId)[0].id
    : 0;

  const { mutate: blockUserInfo, isLoading: isBlockUserInfoLoading } = useMutation(
    userApi.blockInfo,
    {
      onSuccess: (data) => {
        const message = 'success';
        queryClient.invalidateQueries('fetchUserBlockInfoList');
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {},
    }
  );
  const { mutate: removeBlockInfo, isLoading: isRemoveLoading } = useMutation(
    userApi.removeBlockInfo,
    {
      onSuccess: (data) => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('fetchUserBlockInfoList');
      },
    }
  );
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      [`fetchMessagesList`, chatId],
      (pageObject) =>
        userApi.fetchMessagesList({ token, recipientId, senderId: userId }, pageObject),
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      }
    );
  console.log('data', data);

  const handleUserpairremain = async () => {
    console.log('dasdadadasd');

    try {
      const res = await userApi.UserpairremainChat({ chatId, vipTest: isVIP, token });
      console.log('UserpairremainChatressss', res,chatId);
      setRemainTime(res?.limit);
      setRemainTimeValue(remainTime?remainTime:0)
      queryClient.invalidateQueries('getRoomList');
    } catch (error) {
      // Toast.show(JSON.stringify(error));
    }
  };

  useEffect(() => {
    handleUserpairremain();
  }, []);

  const convertFunction = (dataModel) => {
    const result = {};
    const isMine = get(dataModel, 'senderId', '') === userId;
    set(result, 'type', get(dataModel, 'type', 'TEXT'));
    set(result, 'id', get(dataModel, 'id', uniqueId()));
    set(result, 'isMine', isMine);
    set(result, 'msg', get(dataModel, 'content', ''));

    // avatar
    set(
      result,
      'image',
      isMine ? get(dataModel, 'recipientAvatar', '') : get(dataModel, 'senderAvatar', '')
    );
    set(result, 'time', get(dataModel, 'createTime', ''));
    return result;
  };

  const messages = data?.pages
    .map((page) => page.records)
    .flat()
    .map(convertFunction);

  const updateMessage = [
    {
      id: 708,
      image: null,
      isMine: true,
      msg: '哈囉   你好阿',
      time: '2023-05-31 22:38:38',
      type: 'TEXT',
    },
    {
      id: 708,
      image: null,
      msg: 'https://picsum.photos/id/231/200/300',
      isMine: true,
      time: '2023-05-03 22:38:38',
      type: 'BOTH',
    },
    {
      id: 708,
      image: null,
      isMine: false,
      msg: '哈囉   你好阿',
      time: '2023-05-09 22:38:38',
      type: 'TEXT',
    },
    {
      id: 708,
      image: null,
      isMine: true,
      msg: '哈囉   你好阿',
      time: '2023-05-22 22:38:38',
      type: 'TEXT',
    },
    {
      id: 708,
      image: null,
      isMine: false,
      msg: '哈囉   你好阿',
      time: '2023-05-30 22:38:38',
      type: 'TEXT',
    },
    {
      id: 708,
      image: null,
      msg: 'https://picsum.photos/id/231/200/300',
      isMine: false,
      time: '2023-06-10 22:38:38',
      type: 'IMAGE',
    },
  ];

  const keyboardHeight = useKeyboardHeight();
  const [inputValue, setInputValue] = useState('');
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [selectBtn, setSelectBtn] = React.useState(false);
  const [VIPhideModel, setVIPhideModel] = React.useState(false);
  const [VIPblockModel, setVIPblockModel] = React.useState(false);
  const [reportBlockModel, setReportBlockModel] = React.useState(false);
  const [reportHeaderText, setReportHeaderText] = React.useState('');
  const [reportSubHeaderText, setReportSubHeaderText] = React.useState('');
  const [openVIP, setOpenVIP] = React.useState(false);

  const closeMenu = () => setVisible(false);
  const handleHideRoom = async () => {
    try {
      const res = await userApi.hideRoomChat({ recipientId, userId, token });
      Toast.show('隱藏成功');
      queryClient.invalidateQueries('getRoomList');
      closeMenu();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
    setCollectionModal(false);
    setReportBlockModel(false);
  };

  const handleJoinVip = () => {
    navigation.push('VIPPurchaseScreen');
    // navigation.push('PurchaseVIPScreen');
  };

  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      // setPhotos(routePhotos);
      handleSendWebSocket({ photos: routePhotos, type: MessageType.IMAGE });

      navigation.setParams({ photos: null });
    }
  });

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTransparent: true,
  //     headerShown: true,
  //     headerShadowVisible: false,
  //     headerStyle: styles.headerStyle,
  //     headerTintColor: theme.colors.white,
  //     headerBackTitleVisible: true,

  //     headerTitleAlign: 'center',
  //     headerTitle: (props) => {
  //       return (
  //         <>
  //           <Image
  //             style={{ width: 20, height: 20, borderRadius: 20 }}
  //             source={
  //               recipientUserInfo?.avatar ? { uri: recipientUserInfo?.avatar } : defaultAvatar
  //             }
  //           />

  //           <BodyTwo style={styles.headerTitle}>{recipientUserInfo?.name || UN_KNOWN}</BodyTwo>
  //         </>
  //       );
  //     },
  //     headerLeft: (props) => {
  //       return (
  //         <TouchableOpacity onPress={navigation.goBack} style={{}}>
  //           {mapIcon.backIcon({ size: 28 })}
  //         </TouchableOpacity>
  //       );
  //     },
  //     headerRight: (props) => {
  //       return (
  //         <TouchableOpacity style={{ paddingRight: 16 }} onPress={openMenu}>
  //           {mapIcon.more({})}
  //         </TouchableOpacity>
  //       );
  //     },
  //   });
  // },[]);

  const renderMenuComponent = () => {
    return (
      <Menu
        contentStyle={{
          backgroundColor: theme.colors.black2,
          borderRadius: 20,
          paddingVertical: 0,
        }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={{ x: width - 10, y: headerHeight }}>
        <Menu.Item
          style={{
            height: 32,
            paddingHorizontal: 5,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          }}
          onPress={() => {
            closeMenu();
            navigation.navigate('MatchingDetailScreen');
            dispatch(updateCurrentMatchingId(recipientId));
          }}
          title={
            <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
              查看個人資料
            </CaptionFour>
          }
        />
        {
          <Menu.Item
            style={{
              height: 32,
              paddingHorizontal: 5,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            }}
            onPress={() => {
              if (isVIP) {
                setCollectionModal(true);
              } else {
                setVIPhideModel(true);
              }
            }}
            title={
              <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                隱藏對話
              </CaptionFour>
            }
          />
        }
        {
          <Menu.Item
            style={{
              height: 32,
              borderBottomEndRadius: 20,
              paddingHorizontal: 5,
              borderBottomStartRadius: 20,
            }}
            onPress={() => {
              if (isVIP) {
                if (isBlocked) {
                  if (isRemoveLoading) return;
                  if (!isBlockedId) return;
                  removeBlockInfo({ token, id: isBlockedId });
                } else {
                  if (isBlockUserInfoLoading) return;
                  blockUserInfo({ token, userId, blockUserId: recipientId });
                }
              } else {
                setVIPblockModel(true);
              }

              closeMenu();
            }}
            title={
              <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                {isBlocked ? '解除封鎖' : '封鎖用戶'}
              </CaptionFour>
            }
          />
        }
      </Menu>
    );
  };

  const handleConfirm = async () => {
    if (selectBtn) {
      if (isBlocked) {
        if (isRemoveLoading) return;
        if (!isBlockedId) return;
        removeBlockInfo({ token, id: isBlockedId });
        setReportBlockModel(false);
      } else {
        if (isBlockUserInfoLoading) return;
        blockUserInfo({ token, userId, blockUserId: recipientId });
        setReportBlockModel(false);
      }
      setReportBlockModel(false);
    } else {
      handleHideRoom();
    }
    // setBlockChat(true);
  };
  const handleCancel = () => {
    setReportBlockModel(false);
  };
  const handlePressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'RoomChatScreen',
      maxLength: 3,
    });
  };

  const handlePressDeleteSelectImage = (item) => {
    setPhotos((prev) => prev.filter((i) => i.name !== item.name));
  };
  const handleSendMessage = () => {
    if (!inputValue) return;

    handleSendWebSocket({ content: inputValue, type: MessageType.TEXT });
    setInputValue('');
  };

  const isBeBlocked = false;

  const onUserPress = () => {
    // setTimeout(() => {
    //   setOpenVIP(true);
    // }, 1000);
    setVisibleModal(false);
    navigation.navigate('MatchingDetailScreen');
    dispatch(updateCurrentMatchingId(recipientId));
  };
  const onBloackPress = () => {
    if (isVIP) {
      setSelectBtn(true);
      setReportHeaderText('確定封鎖此用戶嗎？');
      setReportSubHeaderText('封鎖用戶後將無法傳送訊息給您');
      setTimeout(() => {
        setReportBlockModel(true);
      }, 1000);
      setVisibleModal(false);
    } else {
      setTimeout(() => {
        setOpenVIP(true);
      }, 1000);
      setVisibleModal(false);
    }
  };
  const onPasswordPress = () => {
    if (isVIP) {
      setSelectBtn(false);
      setReportHeaderText('確定要隱藏此對話嗎?');
      setReportSubHeaderText('隱藏對話後需輸入密碼才能恢復內容');
      setTimeout(() => {
        setReportBlockModel(true);
      }, 1000);
      setVisibleModal(false);
    } else {
      setTimeout(() => {
        setOpenVIP(true);
      }, 1000);
      setVisibleModal(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 10,
        paddingBottom: bottom,
        backgroundColor: theme.colors.black1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
        }}>
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Image
            style={{ width: 20, height: 20, borderRadius: 20 }}
            source={recipientUserInfo?.avatar ? { uri: recipientUserInfo?.avatar } : defaultAvatar}
          /> */}

          <BodyTwo style={styles.headerTitle}>{recipientUserInfo?.name || UN_KNOWN}</BodyTwo>
          <View style={styles.dotStyle} />
        </View>
        <TouchableOpacity
          onPress={() => {
            setVisibleModal(true);
            setBlockChat(false);
          }}
          style={styles.moreStyle}>
          {mapIcon.more({ size: 20, color: theme.colors.black4 })}
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={headerHeight}
        style={{ flex: 1 }}>
        {/* {renderMenuComponent()} */}
        {!isVIP && remainTimeValue !==null ? <View style={styles.headerViewStyle}>
          <Text style={styles.headerTextStyle}>
            {"限時 "}
            <Text style={[styles.headerTextStyle, { color: theme.colors.pink }]}>{remainTimeValue}</Text>
            {" 小時，抓緊時間開始聊天吧！"}
          </Text>
        </View> :null}
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            // data={updateMessage}
            data={messages}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            keyExtractor={(item, index) => `${index}`}
            renderItem={(item) => {
              const { index, item: targetItem } = item;
              const isNextSameDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                parse(updateMessage[index + 1]?.time, 'yyyy-MM-dd HH:mm:ss', new Date())
              );
              const isToday = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date()
              );
              const isYesterDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date(new Date().getDate() - 1)
              );
              const isPrevSame = updateMessage[index + 1]?.isMine === targetItem.isMine;
              if (!isNextSameDay) {
                return (
                  <>
                    <ChatBubble isPrevSame={isPrevSame} data={item} />
                    <View style={styles.lineDateStyle}>
                      <View style={styles.divLineStyle} />
                      <CaptionFive style={styles.timeText}>
                        {isToday
                          ? '今日'
                          : isYesterDay
                          ? '昨日'
                          : moment(targetItem.time).format('ddd, MMM D, hh:mm A')}
                      </CaptionFive>
                      <View style={styles.divLineStyle} />
                    </View>
                  </>
                );
              }
              return <ChatBubble isPrevSame={isPrevSame} data={item} />;
            }}
            inverted
            ListHeaderComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
          />
          <View style={{ flex: 0 }}>
            {/* imageContainer */}
            <View style={styles.selectedImagesContainer}>
              {!isEmpty(photos) &&
                photos.map((item) => (
                  <View style={styles.selectedImageContainer} key={item.name}>
                    <Image style={styles.selectedImage} source={{ uri: item.uri }} />
                    <Icon
                      containerStyle={styles.deleteIcon}
                      onPress={() => handlePressDeleteSelectImage(item)}
                      size={16}
                      name="clear"
                    />
                  </View>
                ))}
            </View>
            {/* <View style={{ paddingLeft: 16, paddingRight: 16 }}>
              {isBeBlocked ? (
                <View style={{ position: 'relative' }}>
                  <TextInput
                    defaultValue="抱歉，您已遭該用戶封鎖，無法再傳送訊息。"
                    keyboardAppearance="dark"
                    placeholderTextColor={theme.colors.black4}
                    style={{
                      borderRadius: 30,
                      backgroundColor: theme.colors.black2,
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      paddingRight: 30,
                      color: theme.colors.white,
                      fontSize: 14,
                      fontWeight: '300',
                    }}
                    editable={false}
                    selectTextOnFocus={false}
                    focusable={false}
                    autoFocus={false}
                    autoCorrect={false}
                  />
                </View>
              ) : (
                <View style={{ position: 'relative' }}>
                  <TextInput
                    value={inputValue}
                    keyboardAppearance="dark"
                    placeholder="輸入聊天內容"
                    autoFocus={true} 
                    placeholderTextColor={theme.colors.black4}
                    style={{
                      borderRadius: 30,
                      backgroundColor: theme.colors.white,
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      paddingRight: 30,
                      color: theme.colors.black,
                      fontSize: 14,
                      fontWeight: '300',
                    }}
                    autoCorrect={false}
                    onChangeText={setInputValue}
                    returnKeyType="send"
                    onSubmitEditing={() => {
                      handleSendMessage();
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: [{ translateX: -10 }, { translateY: -10 }],
                    }}>
                    <TouchableOpacity onPress={handleSendMessage}>
                      {mapIcon.sendIcon({ color: theme.colors.pink, size: 20 })}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View> */}
            {/* <View
              onLayout={e => {
                setBottomHeight(e.nativeEvent.layout.height);
              }}
              style={{ paddingLeft: 16, paddingTop: 16, flexDirection: 'row' }}>
              <TouchableOpacity disabled={isBeBlocked} onPress={handlePressAddImage}>
                {mapIcon.photoIcon({ color: theme.colors.black3 })}
              </TouchableOpacity>
            </View> */}
            <View style={styles.footerStyle}>
              {!isBlocked ? (
                <>
                  {routeVip ? (
                    <>
                      <TouchableOpacity onPress={handlePressAddImage} style={{ marginRight: 12 }}>
                        {mapIcon.photoIcon1({ color: theme.colors.black3 })}
                      </TouchableOpacity>
                      <View style={styles.inputContainer}>
                        <TextInput
                          keyboardAppearance="dark"
                          placeholder="輸入聊天內容"
                          placeholderTextColor={theme.colors.black4}
                          style={styles.inputStyle}
                          returnKeyType="send"
                          value={inputValue}
                          onChangeText={setInputValue}
                          multiline
                        />
                      </View>
                      <TouchableOpacity
                        onPress={handleSendMessage}
                        style={[
                          styles.sendBtn,
                          {
                            backgroundColor: remainTime
                              ? 'rgba(255, 78, 132, 0.6)'
                              : theme.colors.pink,
                          },
                        ]}>
                      
                        {mapIcon.sendIcon({
                          color: remainTime ? theme.colors.black4 : theme.colors.white,
                          size: 16,
                        })}
                     
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <BodyOne style={[styles.footerText, { fontSize: fontSize(16), flex: 1 }]}>
                        {'已超過配對時間，如需繼續維持這段\n緣分，請升級VIP'}
                      </BodyOne>
                      <TouchableOpacity
                        style={styles.vipBtnStyle}
                        onPress={() => {
                          setOpenVIP(true);
                        }}>
                        <Text style={styles.vipText}>升級</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <BodyOne style={styles.footerText}>已封鎖此用戶</BodyOne>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <CommonModalComponent
        isVisible={collectionModal}
        onConfirm={handleHideRoom}
        modalText="確定要隱藏此對話嗎?"
        onClose={() => setCollectionModal(false)}
      />
      <CommonModalComponent
        isVisible={VIPhideModel}
        onConfirm={() => {
          handleJoinVip();
          setVIPhideModel(false);
        }}
        modalText="升級VIP即可使用此功能"
        buttonOneTitle="成為VIP"
        onClose={() => setVIPhideModel(false)}
      />
      <CommonModalComponent
        isVisible={VIPblockModel}
        onConfirm={() => {
          handleJoinVip();
          setVIPblockModel(false);
        }}
        modalText="升級VIP即可使用此功能"
        buttonOneTitle="成為VIP"
        onClose={() => setVIPblockModel(false)}
      />
      <RoomChatBottomModal
        isVisible={visibleModal}
        onClose={() => {
          setVisibleModal(false);
        }}
        onUserPress={onUserPress}
        onBloackPress={onBloackPress}
        onPasswordPress={onPasswordPress}
      />

      <ReportModal
        modalText={reportSubHeaderText}
        buttonOneTitle="刪除"
        buttonTwoTitle="取消"
        headerShow={true}
        isVisible={reportBlockModel}
        onConfirm={handleConfirm}
        showCancel={true}
        headerShowText={reportHeaderText}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={handleCancel}
      />
      <VIPModal
        isVisible={openVIP}
        textShow={true}
        titleText={routeVip ? '升級VIP即可使用此功能' : '升級VIP即可使用此功能'}
        onClose={() => setOpenVIP(false)}
        onConfirmCallback={() => {
          setTimeout(() => {
            handleJoinVip();
          }, 1000);
          setOpenVIP(false);
        }}
      />
    </SafeAreaView>
  );
}
