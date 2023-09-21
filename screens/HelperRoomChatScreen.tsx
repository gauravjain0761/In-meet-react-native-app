import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Button, Icon } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { get, isEmpty, set, uniqueId } from 'lodash';
import { Client, StompConfig } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { Row, Col } from 'react-native-responsive-grid-system';
import { format, isSameDay, parse } from 'date-fns';
import { RootStackScreenProps } from '../types';
import { mapIcon } from '../constants/IconsMapping';
import { BodyTwo, CaptionFive } from '../components/common/Text';
import { useAppDispatch } from '~/store';
import { selectToken, selectUserId } from '~/store/userSlice';
import { userApi } from '~/api/UserAPI';
import useKeyboardHeight from '~/hooks/useKeyboardHeight';
import { convertTime, convertToMMDD } from '~/helpers/convertDate';
import useUploadFile from '~/hooks/useUploadFile';
import logo from '~/assets/images/logo/logo.png';
import { fontSize } from '~/helpers/Fonts';
import moment from 'moment';
import SafeAreaView from 'react-native-safe-area-view';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    marginRight: 15,
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
  chatButtonText: {
    fontSize: fontSize(14),
    color: theme.colors.white,
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
    backgroundColor: theme.colors.pink,
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
}));

function ChatBubble(props: any) {
  const { isMine, image, id, msg, time, isPrevSameDay, type } = props.data.item;

  const { isPrevSame } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const renderLogo = () => {
    return (
      <View
        style={{
          backgroundColor: '#4A4D5A',
          width: 36,
          height: 36,
          borderRadius: 36,
          shadowColor: theme.colors?.black,
          shadowOpacity: 0.5,
          shadowRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image style={{ width: '50%', height: '50%' }} source={logo} />
      </View>
    );
  };
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
            {/* z */}
            <View
              style={{
                backgroundColor: theme.colors.pink,
                maxWidth: 150,
                borderRadius: 10,
                // padding: 7,
              }}>
              <Row>
                {msg?.split(',').map((item: any) => (
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
        {!isPrevSame && renderLogo()}
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
              {msg?.split(',').map((item: any) => (
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
              maxWidth: 260,
              borderRadius: 18,
              borderBottomRightRadius: 0,
              padding: 12,
            }}>
            <CaptionFive style={[{ color: theme.colors.white }, styles.chatButtonText]}>
              {msg}
            </CaptionFive>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.messageBubbleContainer}>
      {!isPrevSame && renderLogo()}
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
          <CaptionFive style={styles.chatButtonText}>{msg}</CaptionFive>
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

const useStompClient = ({ recipientId }: any) => {
  const userId = useSelector(selectUserId);
  const { uploadPhoto } = useUploadFile();
  const stompClientRef = useRef<Client>();
  const chatId = `${userId}_${recipientId}`;

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
        if (!photoContents) return;
        stompClientRef.current.publish({
          destination: `/app/clientChat`,
          body: JSON.stringify({ senderId: userId, recipientId, content: photoContents, type }),
        });
        return;
      }

      stompClientRef.current.publish({
        destination: `/app/clientChat`,
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
      reconnectDelay: 200,
      onConnect(frame) {
        sub1 = stompClientRef.current!.subscribe(
          `/user/${userId}/queue/client/messages`,
          function (message) {
            queryClient.refetchQueries(['fetchMessageClientList', chatId], {
              refetchPage: (lastPage, index) => index === 0,
            });
            queryClient.invalidateQueries(['getRoomList']);
          }
        );
        sub2 = stompClientRef.current!.subscribe(
          `/user/${recipientId}/queue/client/messages`,
          function (message) {
            queryClient.refetchQueries(['fetchMessageClientList', chatId], {
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

export default function HelperRoomChatScreen(props: RootStackScreenProps<'HelperRoomChatScreen'>) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [bottomHeight, setBottomHeight] = useState(0);
  const routeRecipientId = 1;

  const { handleSendWebSocket } = useStompClient({ recipientId: routeRecipientId });
  const userId = useSelector(selectUserId);

  const recipientId = routeRecipientId;
  const chatId = `${userId}_${recipientId}`;

  const token = useSelector(selectToken);
  const dispatch = useAppDispatch();

  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ['fetchMessageClientList', chatId],
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
  const convertFunction = (dataModel) => {
    const result = {};

    set(result, 'type', get(dataModel, 'type', 'TEXT'));
    set(result, 'id', get(dataModel, 'id', uniqueId()));
    set(result, 'isMine', get(dataModel, 'senderId', '') === userId);
    set(result, 'msg', get(dataModel, 'content', ''));

    // avatar
    set(
      result,
      'image',
      get(dataModel, 'senderAvatar', '') || 'https://picsum.photos/id/231/200/300'
    );
    set(result, 'time', get(dataModel, 'createTime', ''));
    return result;
  };

  const messages = data?.pages
    .map((page) => page.records)
    .flat()
    .map(convertFunction);

  const keyboardHeight = useKeyboardHeight();
  const [inputValue, setInputValue] = useState('');
  const [photos, setPhotos] = useState<IPhoto[]>([]);

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
  //     headerBackTitleVisible: false,
  //     headerTitleAlign: 'center',
  //     headerLeft: (props) => (
  //       <TouchableOpacity onPress={navigation.goBack} style={{}}>
  //         {mapIcon.backIcon({ size: 28 })}
  //       </TouchableOpacity>
  //     ),
  //     headerTitle: props => {
  //       return (
  //         <>
  //           <Image
  //             style={{
  //               width: 20,
  //               height: 20,
  //               borderRadius: 20,
  //               shadowColor: theme.colors?.black,
  //               shadowOpacity: 0.5,
  //               shadowRadius: 20,
  //             }}
  //             source={logo}
  //           />

  //           <BodyTwo style={styles.headerTitle}>InMeet 小幫手</BodyTwo>
  //         </>
  //       );
  //     }
  //   });
  // }, []);

  const handlePressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'HelperRoomChatScreen',
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: top + 5,
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
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              shadowColor: theme.colors?.black,
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
            source={logo}
          /> */}

          <BodyTwo style={styles.headerTitle}>InMeet 小幫手</BodyTwo>
        </View>
        <View />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={headerHeight}
        style={{ flex: 1, marginTop: -keyboardHeight }}>
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            // data={test}
            data={messages}
            onEndReached={() => {
              if (hasNextPage) {
                console.log('hasNextPage: ', hasNextPage);
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            keyExtractor={(item, index) => `${index}`}
            renderItem={(item) => {
              const { index, item: targetItem } = item;
              const isNextSameDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                parse(messages[index + 1]?.time, 'yyyy-MM-dd HH:mm:ss', new Date())
              );
              const isToday = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date()
              );
              const isYesterDay = isSameDay(
                parse(targetItem.time, 'yyyy-MM-dd HH:mm:ss', new Date()),
                new Date(new Date().getDate() - 1)
              );
              const isPrevSame = messages[index + 1]?.isMine === targetItem.isMine;
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
              <View style={{  }}>
                <View
                  onLayout={(e) => {
                    setBottomHeight(e.nativeEvent.layout.height);
                  }}
                  style={{ paddingLeft: 16, paddingTop: 16, flexDirection: 'row' }}>
                  <TouchableOpacity onPress={handlePressAddImage}>
                    {mapIcon.photoIcon({ color: theme.colors.black3 })}
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={inputValue}
                  keyboardAppearance="dark"
                  placeholder="輸入聊天內容"
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
                  onChangeText={setInputValue}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: [{ translateX: -8 }, { translateY: -8 }],
                  }}>
                  <TouchableOpacity onPress={handleSendMessage}>
                    {mapIcon.sendIcon({ color: theme.colors.pink, size: 20 })}
                  </TouchableOpacity>
                </View>
              </View>
            </View> */}
            <View style={styles.footerStyle}>
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

              <View style={styles.sendBtn}>
                <Button buttonStyle={styles.sendBtnStyle} onPress={handleSendMessage}>
                  {mapIcon.sendIcon({ color: theme.colors.white, size: 16 })}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
