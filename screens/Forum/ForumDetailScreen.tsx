import { View, TouchableOpacity, Image, useWindowDimensions, TextInput, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Divider, Button } from '@rneui/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const useStyles = makeStyles(theme => ({
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
  avatarDisplayName: {
    color: theme.colors?.white,
  },
  postTime: {
    color: theme.colors?.black4,
  },
  carouselImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
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
  },
  messageWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 40,
    width:'90%',
    paddingBottom: 20,
  },
  grayText: {
    color: theme.colors?.black4,
  },
}));

export default function ForumDetailScreen(props: RootStackScreenProps<'ForumDetailScreen'>) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const currentBlogId = useSelector((state: RootState) => state.forums.currentId);

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
  const inputRef = useRef<TextInput>();
  const token = useSelector(selectToken);
  const [counter ,setcounter]=useState(0);
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
    onSuccess: data => {
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
    onSuccess: data => {},
    onError: () => {},
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries(['fetchProfileBlogs']);
    },
  });
  const { mutate:deleteBlog , isLoading: isDeleteBlogLoading } = useMutation(forumsApi.deleteBlog, {
    onSuccess: data => {},
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
    onSuccess: data => {},
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries('searchForums');
    },
  });

  const { mutate: unLikeForum, isLoading: isUnLikeLoading } = useMutation(forumsApi.unLikeForum, {
    onSuccess: data => {},
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      getCurrent();
      queryClient.invalidateQueries('searchForums');
    },
  });
  const {isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ['fetchBlogRelpy'],
      pageObject => forumsApi.fetchBlogRelpy({token,currentBlogId}, pageObject),
      {
        getNextPageParam: lastPage => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
        refetchOnMount: true,
      },
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
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return <BodyTwo style={styles.headerTitle}>{name} 的貼文</BodyTwo>;
      },
    });
  });
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
  .map(page => page.records).flat().map(records => records);
  const renderBlogReplies = () => {
    return data?.pages.map(page => page.records).flat().map(records => (
      <View key={records.id} style={styles.messageWrapper}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={[styles.imageContainer, { alignSelf: 'center' }]}>
            <Image
              style={styles.avatar}
              source={records.user.avatar ? { uri: records.user.avatar } : defaultAvatar}
            />
          </TouchableOpacity>
          <View style={styles.messageContianer}>
            <SubTitleTwo style={styles.sendMessage}>{records.user.name}</SubTitleTwo>
            <CaptionFive style={[styles.sendMessage]}>
              {records.content}
            </CaptionFive>
          </View>
        </View>
        {/* <CaptionFive style={styles.grayText}>{convertTime(blogReply.modifyTime)}</CaptionFive> */}
      </View>
    ));
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: bottom }}
      style={{ backgroundColor: theme.colors.black1, paddingBottom: 10 }}
      onScroll={({nativeEvent}) => {
        if (hasNextPage&&isCloseToBottom(nativeEvent)) {
          fetchNextPage();
        }
      }}
      scrollEventThrottle={400}
      >
      
      <Loader isLoading={isLoading || isLikeLoading || isUnLikeLoading}>
        <View style={styles.headerContainer}>
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
        </View>
        <View style={{ paddingHorizontal: 16, paddingRight: 20, paddingTop: 5, paddingBottom: 10 }}>
          {content?.split('\\n').map((item, i) => (
            <BodyThree
              key={i}
              style={[{ color: theme.colors.white }, i !== 0 ? { paddingTop: 20 } : {}]}>
              {item}
            </BodyThree>
          ))}
        </View>
        <View
          style={{
            paddingLeft: 16,
            paddingRight: 20,
          }}>
          <Carousel
            onSnapToItem={setActiveSlide}
            data={photos}
            renderItem={renderItem}
            sliderWidth={width - 36}
            itemWidth={width - 36}
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
        <View style={styles.iconContainer}>
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
        </View>
        <Divider
          width={2}
          color={theme.colors.black2}
          style={{ paddingTop: 20, marginBottom: 20 }}
        />

        {renderBlogReplies()}
        {/* <FlatList
          data={data?.pages[0].records}
          onEndReached={
            () => {
              if(hasNextPage){
                fetchNextPage();
              }
            }
          }
          onEndReachedThreshold={0.5}
          renderItem={renderBlogReplies}
          /> */}
        <View style={{ paddingLeft: 16, paddingRight: 20 }}>
          <View style={{ position: 'relative' }}>
            <TextInput
              keyboardAppearance="dark"
              placeholder="回覆貼文"
              placeholderTextColor={theme.colors.black4}
              style={{
                borderRadius: 30,
                backgroundColor: theme.colors.white,
                paddingVertical: 6,
                paddingHorizontal: 14,
                paddingRight: 30,
                color: theme.colors.black,
                fontSize: 14,
                fontWeight: '300',
              }}
              returnKeyType="send"
              value={replyText}
              onChangeText={setReplyText}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: [{ translateX: -8 }, { translateY: -10 }],
              }}>
              <Button
                buttonStyle={{ width: 20, height: 20, backgroundColor: 'transparent' }}
                onPress={handlePressReply}>
                {mapIcon.sendIcon({ color: theme.colors.pink, size: 16 })}
              </Button>
            </View>
          </View>
        </View>
      </Loader>
    </KeyboardAwareScrollView>
  );
}
