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
import { Icon } from '@rneui/base';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { get, isEmpty, set, uniqueId } from 'lodash';
import { Client, Message, StompConfig } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { Row, Col } from 'react-native-responsive-grid-system';
import Toast from 'react-native-root-toast';
import { isSameDay, parse } from 'date-fns';
import { RootStackScreenProps } from '../types';
import { mapIcon } from '../constants/IconsMapping';
import { BodyThree, BodyTwo, CaptionFive, CaptionFour } from '../components/common/Text';
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

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    paddingLeft: 10,
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
    paddingBottom: 20,
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
            <View style={{ alignSelf: 'flex-end', paddingRight: 6 }}>
              <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
            </View>
            <View
              style={{
                backgroundColor: theme.colors.pink,
                maxWidth: 200,
                borderRadius: 10,
                padding: 7,
              }}>
              <Row>
                {msg.split(',').map(item => (
                  <Col key={item} xs={12} sm={12} md={12} lg={12}>
                    <Image
                      style={{ width: '100%', aspectRatio: 1, marginVertical: 5 }}
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
          <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: image }} />
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
              maxWidth: 200,
              marginLeft: !isPrevSame ? 10 : 50,
              borderRadius: 10,
              padding: 7,
            }}>
            <Row>
              {msg.split(',').map(item => (
                <Col key={item} xs={12} sm={12} md={12} lg={12}>
                  <Image
                    style={{ width: '100%', aspectRatio: 1, marginVertical: 5 }}
                    source={{ uri: item }}
                  />
                </Col>
              ))}
            </Row>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingLeft: 6 }}>
            <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
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
          <View style={{ alignSelf: 'flex-end', paddingRight: 6 }}>
            <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.pink,
              maxWidth: 200,
              borderRadius: 14,
              padding: 7,
            }}>
            <BodyThree style={[{ color: theme.colors.white }]} selectable={true}>{msg}</BodyThree>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.messageBubbleContainer}>
      {!isPrevSame && (
        <Image
          style={{ width: 40, height: 40, borderRadius: 40 }}
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
            backgroundColor: 'white',
            maxWidth: 200,
            marginLeft: !isPrevSame ? 10 : 50,
            borderRadius: 14,
            padding: 7,
          }}>
          <BodyThree selectable={true}>{msg}</BodyThree>
        </View>
        <View style={{ alignSelf: 'flex-end', paddingLeft: 6 }}>
          <CaptionFive style={{ color: theme.colors.black4 }}>{convertTime(time)}</CaptionFive>
        </View>
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
      brokerURL: 'wss://api.inmeet.vip/ws',
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
          },
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
          },
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

  const { handleSendWebSocket } = useStompClient();
  const openMenu = () => setVisible(true);
  const userId = useSelector(selectUserId);
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const routeRecipientId = get(route, 'params.recipientId', '');
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
    userApi.fetchUserInfoById({ token, id: recipientId }),
  );

  const { data: blockList } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token }),
  );
  const isBlocked = blockList?.records.map(record => record.blockUser.id).includes(recipientId);
  const isBlockedId = isBlocked
    ? blockList?.records.filter(record => record.blockUser.id === recipientId)[0].id
    : 0;

  const { mutate: blockUserInfo, isLoading: isBlockUserInfoLoading } = useMutation(
    userApi.blockInfo,
    {
      onSuccess: data => {
        const message = 'success';
        queryClient.invalidateQueries('fetchUserBlockInfoList');
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {},
    },
  );
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
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      [`fetchMessagesList`, chatId],
      pageObject => userApi.fetchMessagesList({ token, recipientId, senderId: userId }, pageObject),
      {
        getNextPageParam: lastPage => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      },
    );
  const convertFunction = dataModel => {
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
      isMine ? get(dataModel, 'recipientAvatar', '') : get(dataModel, 'senderAvatar', ''),
    );
    set(result, 'time', get(dataModel, 'createTime', ''));
    return result;
  };

  const messages = data?.pages
    .map(page => page.records)
    .flat()
    .map(convertFunction);

  const keyboardHeight = useKeyboardHeight();
  const [inputValue, setInputValue] = useState('');
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [VIPhideModel, setVIPhideModel] = React.useState(false);
  const [VIPblockModel, setVIPblockModel] = React.useState(false);

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
  };
  const handleJoinVip = () => {
    navigation.push('PurchaseVIPScreen');
  };
  
  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      // setPhotos(routePhotos);
      handleSendWebSocket({ photos: routePhotos, type: MessageType.IMAGE });

      navigation.setParams({ photos: null });
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return (
          <>
            <Image
              style={{ width: 20, height: 20, borderRadius: 20 }}
              source={
                recipientUserInfo?.avatar ? { uri: recipientUserInfo?.avatar } : defaultAvatar
              }
            />

            <BodyTwo style={styles.headerTitle}>{recipientUserInfo?.name || UN_KNOWN}</BodyTwo>
          </>
        );
      },
      headerLeft: props =>
        Platform.OS === 'android' ? null : (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
      headerRight: props => {
        return (
          <TouchableOpacity style={{ paddingRight: 16 }} onPress={openMenu}>
            {mapIcon.more({})}
          </TouchableOpacity>
        );
      },
    });
  });

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
        {(
          <Menu.Item
            style={{
              height: 32,
              paddingHorizontal: 5,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            }}
            onPress={() => {
              if(isVIP){
                setCollectionModal(true);
              }else{
                setVIPhideModel(true);
              }
            }
              
            }
            title={
              <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                隱藏對話
              </CaptionFour>
            }
          />
        )}
        { (
          <Menu.Item
            style={{
              height: 32,
              borderBottomEndRadius: 20,
              paddingHorizontal: 5,
              borderBottomStartRadius: 20,
            }}
            onPress={() => {
              if(isVIP){
                if (isBlocked) {
                  if (isRemoveLoading) return;
                  if (!isBlockedId) return;
                  removeBlockInfo({ token, id: isBlockedId });
                } else {
                  if (isBlockUserInfoLoading) return;
                  blockUserInfo({ token, userId, blockUserId: recipientId });
                }
              }else{
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
        )}
      </Menu>
    );
  };

  const handlePressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'RoomChatScreen',
      maxLength: 3,
    });
  };

  const handlePressDeleteSelectImage = item => {
    setPhotos(prev => prev.filter(i => i.name !== item.name));
  };
  const handleSendMessage = () => {
    if (!inputValue) return;

    handleSendWebSocket({ content: inputValue, type: MessageType.TEXT });
    setInputValue('');
  };

  const isBeBlocked = false;

  return (
    <View style={{ flex: 1, paddingBottom: bottom, backgroundColor: theme.colors.black1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={headerHeight}
        style={{ flex: 1, marginTop: -keyboardHeight }}>
        {renderMenuComponent()}
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            // data={test}
            data={messages}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            keyExtractor={(item, index) => `${index}`}
            renderItem={item => {
              const { index, item: targetItem } = item;
              const isNextSameDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                parse(messages[index + 1]?.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
              );
              const isToday = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date(),
              );
              const isYesterDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date(new Date().getDate() - 1),
              );
              const isPrevSame = messages[index + 1]?.isMine === targetItem.isMine;
              if (!isNextSameDay) {
                return (
                  <>
                    <ChatBubble isPrevSame={isPrevSame} data={item} />
                    <CaptionFive style={styles.timeText}>
                      {isToday ? '今日' : isYesterDay ? '昨日' : convertToMMDD(targetItem.time)}
                    </CaptionFive>
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
                photos.map(item => (
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
            <View style={{ paddingLeft: 16, paddingRight: 16 }}>
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
            </View>
            <View
              onLayout={e => {
                setBottomHeight(e.nativeEvent.layout.height);
              }}
              style={{ paddingLeft: 16, paddingTop: 16, flexDirection: 'row' }}>
              <TouchableOpacity disabled={isBeBlocked} onPress={handlePressAddImage}>
                {mapIcon.photoIcon({ color: theme.colors.black3 })}
              </TouchableOpacity>
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
        modalText="升級VIP即可隱藏此對話"
        buttonOneTitle="成為VIP"
        onClose={() => setVIPhideModel(false)}
      />
      <CommonModalComponent
        isVisible={VIPblockModel}
        onConfirm={() => {
          handleJoinVip();
          setVIPblockModel(false);
        }}
        modalText="升級VIP即可封鎖此用戶"
        buttonOneTitle="成為VIP"
        onClose={() => setVIPblockModel(false)}
      />
    </View>
  );
}
