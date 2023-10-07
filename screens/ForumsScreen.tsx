import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme, Icon } from '@rneui/themed';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import ReadMore from 'react-native-read-more-text';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Button, FAB, Menu } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { get, map } from 'lodash';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import Toast from 'react-native-root-toast';
import {
  BodyTwo,
  BodyThree,
  CaptionFive,
  CaptionFour,
  SubTitleTwo,
} from '../components/common/Text';
import { mapIcon } from '../constants/IconsMapping';
import { RootTabScreenProps } from '../types';
import { RootState, useAppDispatch } from '~/store';
import {
  addForumPostHeart,
  Blog,
  getCurrentForum,
  getForumList,
  replyForumPost,
  selectForums,
  updateCurrentId,
} from '~/store/forumSlice';
import { convertDate } from '~/helpers/convertDate';
import Loader from '~/components/common/Loader';
import { selectToken, selectUserId } from '~/store/userSlice';
import { CollectorUser, forumsApi, userApi } from '~/api/UserAPI';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { BLOCK_REPORT_TYPE } from '~/constants/mappingValue';
import CommonModalComponent from '~/components/common/CommonModalComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import Empty from '../assets/images/like-empty.png';
import { fontSize } from '~/helpers/Fonts';
import backIcon from '../assets/images/icons/icon-back.png';
import SelectBottomModal from '~/components/common/SelectBottomModal';
import moment from 'moment';
import { updateCurrentMatchingId } from '~/store/interestSlice';
const { width } = Dimensions.get('window');
const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
    paddingLeft: 16,
  },
  container: {
    backgroundColor: theme.colors?.black1,
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
    borderRadius: 40 / 2,
  },
  avatarDisplayName: {
    color: theme.colors?.white,
  },
  postTime: {
    color: theme.colors?.black4,
  },
  body: {
    color: theme.colors?.white,
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
  image: {
    aspectRatio: 1,
    borderRadius: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  postDetailContainer: {
    paddingLeft: 6,
    justifyContent: 'center',
  },
  bodyContainer: {
    flexDirection: 'column',
    paddingTop: 8,
    // paddingLeft: 16,
    // paddingRight: 20,
    // height: 80,
    // overflow: 'hidden',
  },
  bodyLeftContainer: {
    paddingTop: 8,
    flexGrow: 1,
    // maxWidth: '80%',
    // paddingRight: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconContainer: {
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
    paddingRight: 10,
    // paddingTop: 5,
    fontSize: fontSize(14),
  },
  chatCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
    // paddingTop: 5,
    fontSize: fontSize(14),
  },
  grayText: {
    color: theme.colors?.black4,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 20,
    paddingBottom: 20,
  },
  listContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 200,
  },
  fabContainer: {
    backgroundColor: '#FF4E84',
  },
  emptyWrapper: {
    backgroundColor: theme.colors?.black1,
    height: '100%',
    paddingHorizontal: 90,
    paddingTop: width * 0.56,
    display: 'flex',
    alignItems: 'center',
  },
}));

enum LEVEL {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

function ForumCardComponent({
  onPress,
  data = {},
  favoriteList = [],
}: {
  data: Blog;
  onPress: () => void;
  favoriteList: CollectorUser[];
}) {
  const styles = useStyles();
  const { avatar: myAvatar } = useSelector((state: RootState) => state.user);
  const { photo, content, user, createTime, id, amount, blogReplies, cover, isLikeBefore } = data;
  const userId = useSelector(selectUserId);
  const replyAmount = blogReplies?.length || 0;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const token = useSelector(selectToken);

  const [visible, setVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [joinVIPModal, setJoinVIPModal] = React.useState(false);
  const [selectModalShow, setSelectModalShow] = React.useState(false);
  const level = useSelector((state: RootState) => state.user.level);
  const queryClient = useQueryClient();
  const { data: blockList } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token })
  );

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
  const dispatch = useAppDispatch();
  const openMenu = () => {
    setVisible(true);
  };
  const closeMenu = () => {
    setVisible(false);
  };
  const isCollected = favoriteList?.map((record) => record.favoriteUser.id).includes(user.id);
  const isBlocked = blockList?.records.map((record) => record.blockUser.id).includes(user.id);
  const isBlockedId = isBlocked
    ? blockList?.records.filter((record) => record.blockUser.id === user.id)[0].id
    : 0;
  const handleBlock = async () => {
    if (isBlockUserInfoLoading) return;
    await blockUserInfo({ token, userId, blockUserId: user.id });
    Toast.show('用戶已封鎖');
  };
  const handleRemoveBlock = () => {
    if (isBlockUserInfoLoading) return;
    removeBlockInfo({ token, id: isBlockedId });
    Toast.show('用戶已解除封鎖');
  };
  const { mutate: mutateCollect, isLoading: isCollectLoading } = useMutation(userApi.collectUser, {
    onSuccess: (data) => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('getFavoriteUser');
    },
  });
  const { mutate: removeMutate, isLoading: removeLoading } = useMutation(
    userApi.removeCollectUser,
    {
      onSuccess: (data) => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('getFavoriteUser');
      },
    }
  );

  const { mutate: likeForum, isLoading: isLikeLoading } = useMutation(forumsApi.likeForum, {
    onSuccess: (data) => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('searchForums');
    },
  });

  const { mutate: unLikeForum, isLoading: isUnLikeLoading } = useMutation(forumsApi.unLikeForum, {
    onSuccess: (data) => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('searchForums');
    },
  });

  const handleLike = () => {
    if (!id || isCollectLoading || removeLoading) {
      return;
    }
    if (isCollected) {
      const dataRecordIndex = favoriteList?.findIndex((item) => item.favoriteUser.id === user.id);
      const dataRecordId = get(favoriteList, `${dataRecordIndex}.id`, '');
      if (dataRecordId) {
        removeMutate({ token, dataRecordId });
      }
      return;
    }
    mutateCollect({
      token,
      userId,
      favoriteUserId: user.id,
    });
  };

  const itemStyle = {
    height: 32,
    borderBottomEndRadius: 20,
    paddingHorizontal: 5,
    borderBottomStartRadius: 20,
  };

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

  const handlePressLike = async () => {
    if (userId === user.id) return;
    if (isUnLikeLoading || isLikeLoading) return;
    if (isLikeBefore) {
      unLikeForum({ token, id });
      return;
    }
    likeForum({ token, id });
  };

  const handlePressReply = async () => {
    if (!replyText) return;
    if (isReplyLoading) return;
    const payload = {
      content: replyText,
      blogId: id,
      userId,
    };
    try {
      setIsReplyLoading(true);
      await dispatch(replyForumPost(payload))
        .unwrap()
        .then(() => dispatch(getCurrentForum({ id })));
      setReplyText('');
      queryClient.invalidateQueries('searchForums');
    } catch (error) {}
    setIsReplyLoading(false);
  };

  const handleJoinVip = () => {
    navigation.push('PurchaseVIPScreen');
  };
  return (
    <Loader isLoading={isLikeLoading || isReplyLoading || isUnLikeLoading}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={()=>{
             if (user?.id) {
              navigation.navigate('MatchingDetailScreen');      
              dispatch(updateCurrentMatchingId(user?.id));
            }
          }}  activeOpacity={1} style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              source={user.avatar ? { uri: user.avatar } : defaultAvatar}
            />
          </TouchableOpacity>
          <View style={styles.postDetailContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <BodyTwo style={styles.avatarDisplayName}>{user?.name}</BodyTwo>
              <TouchableOpacity onPress={handleLike} style={{ paddingLeft: 5 }}>
                {mapIcon.vipdiamondIcon({
                  size: 18,
                  // color: isCollected ? theme.colors.yellow : theme.colors.black4,
                  color: theme.colors.yellow,
                })}
              </TouchableOpacity>
            </View>
            <CaptionFive style={styles.postTime}>{moment(createTime).format('MMM D, hh:mm a')}</CaptionFive>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {/* <Menu
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
              <Menu.Item
              style={itemStyle}
              onPress={handlePressReportBlog}
              title={
                <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                  檢舉此動態
                </CaptionFour>
              }
            />
            <Menu.Item
              style={itemStyle}
              onPress={handlePressReportUser}
              title={
                <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                  檢舉此用戶
                </CaptionFour>
              }
            />
            <Menu.Item
              style={{
                height: 32,
                paddingHorizontal: 5,
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
              }}
              onPress={() => {
                if (isBlocked) {
                  handleRemoveBlock();
                } else {
                  setJoinVIPModal(true);
                  closeMenu();
                }
              }}
              title={
                <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                  {isBlocked ? '解除封鎖此用戶' : '封鎖此用戶'}
                </CaptionFour>
              }
            />
          </Menu> */}
          <TouchableOpacity
            onPress={() => {
              setSelectModalShow(true);
            }}
            style={styles.moreStyle}>
            {mapIcon.more({ size: 20, color: theme.colors.black4 })}
          </TouchableOpacity>
        </View>
      </View>

      {/* body */}
      {/* react native text more */}

      <TouchableOpacity onPress={onPress}>
        <View style={styles.bodyContainer}>
          {Boolean(photo) && (
            <Image
              style={styles.image}
              source={{
                uri: get(photo?.split(','), '[0]', '') || `https://picsum.photos/id/232/200/300`,
              }}
            />
          )}
          <View style={styles.bodyLeftContainer}>
            <BodyThree style={styles.body}>
              {/* {item}{' '} */}
              {content.substring(0, 30)}
            </BodyThree>
            {content.length > 30 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <BodyThree style={styles.grayText}>更多</BodyThree>
                <Image
                  source={backIcon}
                  style={{
                    tintColor: theme.colors.black4,
                    width: 15,
                    height: 15,
                    transform: [{ rotate: '180deg' }],
                  }}
                />
              </View>
            )}
            {/* <ReadMore
              numberOfLines={1}
              renderTruncatedFooter={props => (
                  <BodyThree style={styles.grayText}>更多</BodyThree>
              )}>
              {content.split('\\n').map((item, i) => (
                <BodyThree key={i} style={styles.body}>
                  {item}{' '}
                </BodyThree>
              ))}
            </ReadMore> */}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        {/* <View style={{flexDirection:'row',alignItems:'center'}}> */}

        <TouchableOpacity onPress={handlePressLike}>
          {isLikeBefore
            ? mapIcon.likeIcon({
                size: 20,
                color: theme.colors.pink,
              })
            : mapIcon.unlikeIcon({
                size: 20,
                color: theme.colors.black4,
              })}
        </TouchableOpacity>

        <CaptionFour style={styles.likeCount}>{amount || 0}</CaptionFour>
        {/* </View> */}
        {mapIcon.commentIcon({ size: 20, color: theme.colors.black4 })}
        <CaptionFour style={styles.chatCount}>{replyAmount || 0}</CaptionFour>
      </View>
      {/* <View style={{ paddingTop: 10 }}>
        {blogReplies &&
          blogReplies
            .slice(-2)
            .map(blogReply => <BlogReplyItem blogReply={blogReply} key={blogReply.id} />)}
      </View> */}

      <View style={styles.messageContainer}>
        <View style={[{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
          <Image
            style={[styles.avatar, { width: 20, height: 20, borderRadius: 20 }]}
            source={myAvatar ? { uri: myAvatar } : defaultAvatar}
          />
        </View>
        <TextInput
          keyboardAppearance="dark"
          placeholder="回覆留言..."
          placeholderTextColor={theme.colors.black4}
          style={{
            flex: 1,
            borderRadius: 30,
            paddingLeft: 8,
            paddingRight: 30,
            color: theme.colors.white,
            fontSize: fontSize(14),
            fontWeight: '300',
          }}
          value={replyText}
          onChangeText={setReplyText}
          returnKeyType="send"
          onSubmitEditing={() => {
            handlePressReply();
          }}
        />
        {/* <BodyThree style={[styles.grayText, { paddingLeft: 5 }]} /> */}
      </View>
      <CommonModalComponent
        isVisible={joinVIPModal}
        modalText={level === LEVEL.VIP ? `確定要封鎖嗎` : `加入VIP即可封鎖此用戶`}
        onConfirm={() => {
          if (level === LEVEL.VIP) {
            handleBlock();
          } else {
            handleJoinVip();
          }

          setJoinVIPModal(false);
        }}
        onClose={() => setJoinVIPModal(false)}
      />
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
  );
}

export default function ForumsScreen(props: RootTabScreenProps<'Forums'>) {
  const ref = React.useRef<FlatList>(null);
  const { navigation } = props;
  const route = useRoute();
  const styles = useStyles();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const token = useSelector(selectToken);
  const [refreshing, setRefreshing] = React.useState(false);
  const [listindex, setListIndex] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const scrollHandler = (e) => {
    if (e.nativeEvent.contentOffset.y - offset > 0 && listindex < forums.length - 1) {
      setListIndex(listindex + 1);
      setOffset(e.nativeEvent.contentOffset.y);
    } else if (e.nativeEvent.contentOffset.y - offset < 0 && listindex > 0) {
      setListIndex(listindex - 1);
      setOffset(e.nativeEvent.contentOffset.y);
    }
  };
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ['searchForums'],
      (pageObject) => forumsApi.fetchAllForums({ token }, pageObject),
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

  const { data: favoriteList } = useQuery('getFavoriteUser', () =>
    userApi.getFavoriteUser({ token })
  );
  const forums = data?.pages
    .map((page) => page.records)
    .flat()
    .filter((item) => !item.isHidden);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    refetch();
  }, []);
  const dispatch = useAppDispatch();
  const handlePressAddIcon = () => {
    navigation.navigate('AddPostScreen');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
    });
  });
  useEffect(() => {
    ref.current?.scrollToIndex({ index: listindex, animated: true, viewPosition: 0.5 });
  }, [listindex]);

  const handlePressOnForumCard = (blogId: number) => {
    dispatch(updateCurrentId(blogId));
    navigation.push('ForumDetailScreen');
   
  };
  const renderRow = ({ item, index }: { item: Blog; index }) => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.black1,
        }}>
        <ForumCardComponent
          favoriteList={favoriteList?.records}
          data={item}
          onPress={() => handlePressOnForumCard(item.id)}
          key={item.id}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyWrapper}>
        {/* <Image style={{ width: 180, height: 136, marginBottom: 4 }} source={Empty} /> */}
        {mapIcon.tabViewBgIcon({ size: 140 })}
        <Text
          style={{
            color: theme.colors.white,
            textAlign: 'center',
            fontSize: fontSize(16),
            lineHeight: 25,
            marginTop: 20,
            fontFamily: 'roboto',
          }}>
          尚未發布任何動態
        </Text>
      </View>
    );
  };

  return (
    <Loader isLoading={false}>
      <View style={styles.listContainer}>
        <FAB
          icon="plus"
          color="#FFFFFF"
          style={styles.fabContainer}
          onPress={handlePressAddIcon}></FAB>
      </View>
      {forums && forums.length > 0 ? (
        <KeyboardAvoidingView
          style={[styles.container, { flex: 1, backgroundColor: theme.colors.black1 }]}>
          <FlatList
            renderItem={(index) => renderRow(index)}
            data={forums}
            // initialScrollIndex={listindex}
            ref={ref}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onScrollBeginDrag={e => setOffset(e.nativeEvent.contentOffset.y)}
            // onScrollEndDrag={scrollHandler}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => item.id.toString()}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
          />
        </KeyboardAvoidingView>
      ) : (
        renderEmpty()
      )}
    </Loader>
  );
}
