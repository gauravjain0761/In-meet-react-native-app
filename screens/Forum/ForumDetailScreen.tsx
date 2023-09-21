import {
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  TextInput,
  FlatList,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Divider, Button } from '@rneui/base';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Menu } from 'react-native-paper';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { mapIcon } from '../../constants/IconsMapping';
import {
  BodyThree,
  BodyTwo,
  CaptionFive,
  CaptionFour,
  SubTitleTwo,
} from '../../components/common/Text';
import { RootStackScreenProps } from '../../types';
import { Blog, getCurrentForum, replyForumPost, selectCurrentForum } from '~/store/forumSlice';
import { convertDate, convertTime } from '~/helpers/convertDate';
import { RootState, useAppDispatch } from '~/store';
import { selectToken, selectUserId } from '~/store/userSlice';
import Loader from '~/components/common/Loader';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { forumsApi, userApi } from '~/api/UserAPI';
import { BLOCK_REPORT_TYPE } from '~/constants/mappingValue';
import { DataTableTitle } from 'react-native-paper/lib/typescript/components/DataTable/DataTableTitle';
import Navigation from '~/navigation';
import { fontSize } from '~/helpers/Fonts';
import SelectBottomModal from '~/components/common/SelectBottomModal';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    flex:1
  },
  postDetailContainer: {
    paddingLeft: 6,
    justifyContent: 'center',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  avatar: {
    resizeMode: 'cover',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  addAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
  },
  headerAvatar: {
    resizeMode: 'cover',
    width: 20,
    height: 20,
    borderRadius: 20,
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
  avatarDisplayName: {
    color: theme.colors?.white,
    fontSize: fontSize(18),
    marginLeft: 5,
  },
  postTime: {
    color: theme.colors?.black4,
    marginTop: 10,
  },
  carouselImage: {
    width: '100%',
    aspectRatio: 1,
    // borderRadius: 10,
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 20,
    paddingTop: 12,
  },
  likeCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
    paddingRight: 10,
  },
  chatCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
  },
  sendMessage: {
    color: theme.colors?.white,
  },
  messageContianer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    flex:1
  },
  messageWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
    // paddingRight: 40,
    // width: '90%',
    // paddingBottom: 20,
    flex:1,
  },
  grayText: {
    color: theme.colors?.black4,
  },
  footerStyle: {
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black1,
    borderTopWidth: 1,
    paddingTop: 10,
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
  likeStyle: {
    flexDirection: 'row',
    width: 86,
    height: 40,
    borderRadius: 40,
    backgroundColor: theme.colors.black2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  chatStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
}));

export default function ForumDetailScreen(props: RootStackScreenProps<'ForumDetailScreen'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const currentBlogId = useSelector((state: RootState) => state.forums.currentId);
  const { avatar: myAvatar } = useSelector((state: RootState) => state.user);
  const [selectModalShow, setSelectModalShow] = React.useState(false);

  const blogPost: Blog = useSelector(selectCurrentForum);

  const {
    id,
    user = {},
    createTime,
    photo,
    content,
    isHidden,
    isLikeBefore,
    blogReplies,
  } = blogPost;
  const isLock = isHidden;
  const { name, avatar, id: blogUserId } = user;
  const [visible, setVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const inputRef = useRef<TextInput>();
  const token = useSelector(selectToken);
  const [counter, setcounter] = useState(0);
  const userId = useSelector(selectUserId);
  const isMyPost = userId === blogUserId;
  const dispatch = useAppDispatch();
  const openMenu = () => {
    setVisible(true);
  };
  const closeMenu = () => {
    setVisible(false);
  };
  const queryClient = useQueryClient();
  const getCurrent = async () => {
    setIsLoading(true);
    try {
      await dispatch(getCurrentForum({ id: currentBlogId })).unwrap();
    } catch (error) {}
    setIsLoading(false);
  };
  const { mutate: lockBlog, isLoading: isLockBlogLoading } = useMutation(userApi.lockBlog, {
    onSuccess: (data) => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries(['fetchProfileBlogs']);
    },
  });
  const { mutate: unLockBlog, isLoading: isUnLockBlogLoading } = useMutation(userApi.unLockBlog, {
    onSuccess: (data) => {},
    onError: () => {},
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries(['fetchProfileBlogs']);
    },
  });
  const { mutate: deleteBlog, isLoading: isDeleteBlogLoading } = useMutation(forumsApi.deleteBlog, {
    onSuccess: (data) => {},
    onError: () => {
      console.log(Error);
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries('searchForums');
      navigation.goBack();
    },
  });
  const { mutate: likeForum, isLoading: isLikeLoading } = useMutation(forumsApi.likeForum, {
    onSuccess: (data) => {},
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries('searchForums');
    },
  });

  const { mutate: unLikeForum, isLoading: isUnLikeLoading } = useMutation(forumsApi.unLikeForum, {
    onSuccess: (data) => {},
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries('searchForums');
    },
  });
  const { isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
    ['fetchBlogRelpy'],
    (pageObject) => forumsApi.fetchBlogRelpy({ token, currentBlogId }, pageObject),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page.totalPage !== lastPage.page.currentPage) {
          return lastPage.page.currentPage + 1;
        }
        return undefined;
      },
      refetchOnMount: true,
    }
  );
  useEffect(() => {
    getCurrent();
  }, []);

  const handlePressReportUser = () => {
    // @ts-ignore
    navigation.navigate('ReportScreen', {
      id: blogPost.user.id,
      blockReportType: BLOCK_REPORT_TYPE.USER,
    });
    setVisible(false);
  };

  const handlePressReportBlog = () => {
    // @ts-ignore
    navigation.navigate('ReportScreen', {
      id,
      blockReportType: BLOCK_REPORT_TYPE.BLOG,
    });
    setVisible(false);
  };
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     // headerTransparent: true,
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
  //     headerTitle:"dsd"
  //   });
  // });
  const photos = photo?.split(',') || [];

  const renderItem = ({ item }) => {
    return <Image style={styles.carouselImage} source={{ uri: item }} />;
  };

  const itemStyle = {
    height: 32,
    borderBottomEndRadius: 20,
    paddingHorizontal: 5,
    borderBottomStartRadius: 20,
  };

  const handlePressReply = async () => {
    if (!replyText) return;
    const payload = {
      content: replyText,
      blogId: id,
      userId,
    };
    try {
      setIsLoading(true);
      await dispatch(replyForumPost(payload))
        .unwrap()
        .then(() => dispatch(getCurrentForum({ id: currentBlogId })));
      setReplyText('');
      refetch();
    } catch (error) {}
    setIsLoading(false);
  };
  const handlePressLike = async () => {
    if (userId === user?.id) return;
    if (isUnLikeLoading || isLikeLoading) return;
    if (isLikeBefore) {
      unLikeForum({ token, id });
      return;
    }
    likeForum({ token, id });
  };
  const message = data?.pages
    .map((page) => page.records)
    .flat()
    .map((records) => records);
  const renderBlogReplies = () => {
    return data?.pages
      .map((page) => page.records)
      .flat()
      .map((records) => (
        <View key={records.id} style={styles.messageWrapper}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={[styles.imageContainer, { alignSelf: 'center' }]}>
              <Image
                style={styles.avatar}
                source={records.user.avatar ? { uri: records.user.avatar } : defaultAvatar}
              />
            </TouchableOpacity>
            <View style={styles.messageContianer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BodyTwo style={[styles.sendMessage, {flex:1 }]}>
                  {records.user.name}
                </BodyTwo>
                <CaptionFour style={styles.sendMessage}>{convertTime(records.modifyTime)}</CaptionFour>
              </View>
              <CaptionFour style={[styles.sendMessage,{marginTop:3}]}>{records.content}</CaptionFour>
            </View>
          </View>
          <Divider
              width={1}
              color={theme.colors.black2}
              style={{ paddingTop: 10, marginTop: 3, marginLeft:45,marginBottom:10 }}
            />
          {/* <CaptionFive style={styles.grayText}>{convertTime(records.modifyTime)}</CaptionFive> */}
        </View>
      ));
  };
  const HeaderView = () => {
    return (
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
        <View style={{ flexDirection: 'row',alignItems:'center' }}>
          <Image
            style={styles.headerAvatar}
            source={user.avatar ? { uri: user.avatar } : defaultAvatar}
          />
          <SubTitleTwo style={styles.avatarDisplayName}>{name}</SubTitleTwo>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectModalShow(true);
          }}
          style={styles.moreStyle}>
          {mapIcon.more({ size: 20, color: theme.colors.black4 })}
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.black1, flex: 1, paddingTop: top - 10 }}>
      <HeaderView />
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}
        // style={{ backgroundColor: theme.colors.black1,flex:1 }}
        keyboardShouldPersistTaps="always"
        onScroll={({ nativeEvent }) => {
          if (hasNextPage && isCloseToBottom(nativeEvent)) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={400}>
        <Loader isLoading={isLoading || isLikeLoading || isUnLikeLoading}>
          <View style={{ flex: 1 }}>
            {/* <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity style={styles.imageContainer}>
                <Image
                  style={styles.avatar}
                  source={user.avatar ? { uri: user.avatar } : defaultAvatar}
                />
              </TouchableOpacity>
              <View style={styles.postDetailContainer}>
                <SubTitleTwo style={styles.avatarDisplayName}>{name}</SubTitleTwo>
                <CaptionFive style={styles.postTime}>{convertDate(createTime)}</CaptionFive>
              </View>
            </View>
            <Menu
              contentStyle={{
                backgroundColor: theme.colors.black2,
                borderRadius: 20,
                paddingVertical: 0,
              }}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  {mapIcon.more({ size: 20, color: theme.colors.black4 })}
                </TouchableOpacity>
              }>
              {isMyPost && (
                <Menu.Item
                  style={itemStyle}
                  onPress={() => {
                    if (isLockBlogLoading || isUnLockBlogLoading) return;
                    if (isLock) {
                      // 解鎖
                      unLockBlog({ token, blogId: id });
                    } else {
                      // 上鎖
                      lockBlog({ token, blogId: id });
                    }
                    closeMenu();
                  }}
                  title={
                    <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                      {isLock ? '解鎖此動態' : '上鎖此動態'}
                    </CaptionFour>
                  }
                />
              )}
              {isMyPost && (
                <Menu.Item
                  style={itemStyle}
                  onPress={() => {
                    deleteBlog({ token, id: id });
                    closeMenu();
                  }}
                  title={
                    <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                      刪除此動態
                    </CaptionFour>
                  }
                />
              )}
              {!isMyPost && (
                <Menu.Item
                  style={itemStyle}
                  onPress={handlePressReportUser}
                  title={
                    <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                      檢舉此用戶
                    </CaptionFour>
                  }
                />
              )}
              {!isMyPost && (
                <Menu.Item
                  style={itemStyle}
                  onPress={handlePressReportBlog}
                  title={
                    <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                      檢舉此動態
                    </CaptionFour>
                  }
                />
              )}
            </Menu>
          </View> */}

            {Boolean(photo) && (
              <View>
                <Carousel
                  onSnapToItem={setActiveSlide}
                  data={photos}
                  renderItem={renderItem}
                  sliderWidth={width}
                  itemWidth={width}
                />
                <Pagination
                  dotsLength={photos.length}
                  activeDotIndex={activeSlide}
                  containerStyle={{
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    paddingBottom: 15,
                  }}
                  dotContainerStyle={{
                    marginHorizontal: 5,
                  }}
                  dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                  }}
                  dotColor={theme.colors.white}
                  inactiveDotScale={1}
                  inactiveDotColor="#C4C4C4"
                />
              </View>
            )}
            <View
              style={{ paddingHorizontal: 16, paddingRight: 20, paddingTop: 8, paddingBottom: 10 }}>
              {content?.split('\\n').map((item, i) => (
                <BodyThree
                  key={i}
                  style={[{ color: theme.colors.white }, i !== 0 ? { paddingTop: 20 } : {}]}>
                  {item}
                </BodyThree>
              ))}
              <CaptionFive style={styles.postTime}>{convertDate(createTime)}</CaptionFive>
            </View>
            {/* <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handlePressLike}>
              <View style={{ flexDirection: 'row' }}>
                {mapIcon.likeIcon({
                  size: 14,
                  color: isLikeBefore ? theme.colors.pink : theme.colors.black4,
                })}
                <CaptionFour style={styles.likeCount}>{blogPost?.amount || 0}</CaptionFour>
              </View>
            </TouchableOpacity>
            {mapIcon.chatIcon({ size: 14, color: theme.colors.black4 })}
            <CaptionFour style={styles.chatCount}>{blogPost.blogReplies?.length || 0}</CaptionFour>
          </View> */}
            <Divider
              width={2}
              color={theme.colors.black2}
              style={{ paddingTop: 20, marginBottom: 20, marginHorizontal: 16 }}
            />
            <View style={styles.chatStyle}>
              <BodyTwo style={styles.chatCount}>{blogPost.blogReplies?.length || 0}</BodyTwo>
              <BodyTwo style={styles.chatCount}>{'則留言'}</BodyTwo>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 10 }}>{renderBlogReplies()}</ScrollView>
          </View>
          <View style={styles.footerStyle}>
            {!keyboardStatus && (
              <Image
                style={[styles.avatar, styles.addAvatar]}
                source={myAvatar ? { uri: myAvatar } : defaultAvatar}
              />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                keyboardAppearance="dark"
                placeholder="回覆貼文"
                placeholderTextColor={theme.colors.black4}
                style={styles.inputStyle}
                returnKeyType="send"
                value={replyText}
                onChangeText={setReplyText}
                multiline
              />
            </View>
            {keyboardStatus ? (
              <View style={styles.sendBtn}>
                <Button buttonStyle={styles.sendBtnStyle} onPress={handlePressReply}>
                  {mapIcon.sendIcon({ color: theme.colors.white, size: 16 })}
                </Button>
              </View>
            ) : (
              <View style={styles.likeStyle}>
                <TouchableOpacity onPress={handlePressLike}>
                  { isLikeBefore  ? mapIcon.likeIcon({
                    size: 20,
                    color:  theme.colors.pink
                  }):  mapIcon.unlikeIcon({
                    size: 20,
                    color:  theme.colors.black4
                  })}
                </TouchableOpacity>
                <CaptionFour style={[styles.likeCount, { marginLeft: 8 }]}>
                  {blogPost?.amount || 0}
                </CaptionFour>
              </View>
            )}
          </View>
          <SelectBottomModal
            isVisible={selectModalShow}
            onDeletePress={() => {
              setSelectModalShow(false);
              // @ts-ignore
              navigation.navigate('ReportScreen', {
                id: user?.id,
                blockReportType: BLOCK_REPORT_TYPE.USER,
              });
            }}
            onClose={() => {
              setSelectModalShow(false);
            }}
          />
        </Loader>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
