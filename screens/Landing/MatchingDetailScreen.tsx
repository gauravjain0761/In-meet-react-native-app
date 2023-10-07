import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SceneMap, TabBar, TabBarItem, TabView } from 'react-native-tab-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Menu } from 'react-native-paper';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import Toast from 'react-native-root-toast';
import { MatchingDetailScreenProps } from '../../navigation/LandingNavigator';
import { CaptionFour } from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ChatButton, LikeButton } from '../../components/common/Button';
import AboutMe from '../../components/AboutMe';
import BioInfo from '../../components/BioInfo';
import CommonModalComponent from '../../components/common/CommonModalComponent';
import ConfirmChatModal from '../../components/common/ConfirmChatModal';
import AboutPhoto from '~/components/AboutPhotos';
import AboutPost from '~/components/AboutPost';
import { userApi } from '~/api/UserAPI';
import { RootState, useAppDispatch } from '~/store';
import { selectToken, selectUserId } from '~/store/userSlice';
import { updateCurrentChatId } from '~/store/roomSlice';
import { BLOCK_REPORT_TYPE } from '~/constants/mappingValue';
import { color } from '@rneui/base';
import matchBg from '../../assets/images/icons/matchBg.png';
import SearchAboutPost from '~/components/SearchAboutPost';
import SelectModal from '~/components/common/SelectModal';
import VIPModal from '~/components/common/VIPModal';
import VIPConnectLockModal from '~/components/common/VIPConnectLockModal';

const { height, width } = Dimensions.get('window');
const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    aspectRatio: 1.5,
    resizeMode: 'cover',
    height: 370,
  },
  forDefaultAvatar: {
    top: '25%',
    left: '12.5%',
    height: '50%',
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
    opacity: 0,
  },
  floatButtonContainer: {
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: -25,
    flexDirection: 'row',
    right: 0,
  },
  floatButton: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  likeIconStyle:{
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.black2,
    height: 48,
    justifyContent: 'center',
    borderRadius: 20,
  }
}));
enum LEVEL {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

export default function MatchingDetailScreen(props: MatchingDetailScreenProps) {
  const { navigation, route } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const [index, setIndex] = React.useState(0);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [joinVIPModal, setJoinVIPModal] = React.useState(false);
  const [chatModal, setChatModal] = React.useState(false);
  const [selectModalShow, setSelectModalShow] = React.useState(false);
  const [openVIP, setOpenVIP] = React.useState(false);
  const [openLockVIP, setOpenLockVIP] = React.useState(false);

  // const [routes] = React.useState([
  //   { key: 'first', title: '關於我' },
  //   { key: 'second', title: '動態' },
   // { key: 'third', title: '相簿' },
  // ]);
  const [routes] = React.useState([
    { key: 'first', title: '關於我' },
    { key: 'second', title: '動態' },
   
  ]);
  const { bottom, top } = useSafeAreaInsets();
  const userId = useSelector(selectUserId);
  const level = useSelector((state: RootState) => state.user.level);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUserId = useSelector((state: RootState) => state.interest.currentMatchingId);
  const token = useSelector(selectToken);

  const { data: userInfoData } = useQuery(
    ['fetchUserInfoById', currentUserId],
    () => userApi.fetchUserInfoById({ token, id: currentUserId }),
    {
      refetchOnMount: true,
    }
  );
  console.log("userInfoData",userInfoData);
  
  const { data: favoriteList } = useQuery('getFavoriteUser', () =>
    userApi.getFavoriteUser({ token })
  );
  const { data: avatarList } = useQuery(['fetchUserAvatars', currentUserId], () =>
    userApi.fetchUserAvatars({ token, id: currentUserId })
  );
  const { data: blockList } = useQuery(['fetchUserBlockInfoList'], () =>
    userApi.fetchUserBlockInfoList({ token })
  );
  const isBlocked = blockList?.records.map((record) => record.blockUser.id).includes(currentUserId);
  const isBlockedId = isBlocked
    ? blockList?.records.filter((record) => record.blockUser.id === currentUserId)[0].id
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
  const { mutate, isLoading } = useMutation(userApi.collectUser, {
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
  const [tabViewHeight, setTabViewHeight] = React.useState(100);
  const moreButtonRef = useRef();
  const adjustHeight = (value: number) => {
    if (tabViewHeight < value) {
      setTabViewHeight(value);
    }
  };

  const data =
    avatarList?.records.length !== 0 && avatarList
      ? avatarList?.records.map((record) => record.fileInfoResponse.url)
      : [''];

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const onShare = async () => {
    try {
      // TODO: share some image info or other bio to some one
      const result = await Share.share({
        message:
          '情緣一線牽，交友樂無邊！找尋知音，共享喜悅，讓我們相識相知吧~~\nIOS APP:https://apps.apple.com/tw/app/inmeet/id6443790744\nAndroid APP:https://play.google.com/store/apps/details?id=com.inmeet.inmeet',
      });
      console.log(result.action, 'action');
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error?.message);
    }
  };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTransparent: true,
  //     headerShown: true,
  //     headerShadowVisible: false,
  //     headerStyle: styles.headerStyle,
  //     headerTintColor: theme.colors.white,
  //     headerBackTitleVisible: false,
  //     headerTitleAlign: 'center',
  //     headerLeft: props =>
  //         <TouchableOpacity onPress={navigation.goBack} style={{ }}>
  //         {mapIcon.backIcon({size:28})}
  //       </TouchableOpacity>
  //       ,
  //     headerRight: props => {
  //       return (
  //         <View style={{ flexDirection: 'row' }}>
  //           <TouchableOpacity onPress={onShare} style={{ paddingRight: 10 }}>
  //             {mapIcon.shareIcon()}
  //           </TouchableOpacity>
  //           <TouchableOpacity onPress={openMenu}>{mapIcon.more()}</TouchableOpacity>
  //         </View>
  //       );
  //     },
  //     headerTitle: '',
  //   });
  // }, []);

  const renderItem = ({ item }) => {
    if (avatarList?.records.length == 0) {
      return (
        <View style={[styles.forDefaultAvatar, { justifyContent: 'center', alignItems: 'center' }]}>
          <mapIcon.defaultAvatar color={'#8E8E8F'} />
        </View>
      );
    }
    return <Image style={styles.image} source={{ uri: item }} />;
  };
  const isCollected = favoriteList?.records
    ?.map((record) => record.favoriteUser.id)
    .includes(currentUserId);
  const handleLike = () => {
    if (!currentUserId || isLoading || removeLoading) {
      return;
    }
    if (isCollected) {
      const dataRecordIndex = favoriteList?.records?.findIndex(
        (item) => item.favoriteUser.id === currentUserId
      );
      const dataRecordId = get(favoriteList?.records, `${dataRecordIndex}.id`, '');
      if (dataRecordId) {
        removeMutate({ token, dataRecordId });
      }
      return;
    }
    mutate({
      token,
      userId,
      favoriteUserId: currentUserId,
    });
  };

  const renderFloatButtonContainer = () => {
    return (
      <View style={styles.floatButtonContainer}>
        <ChatButton
          buttonStyle={styles.floatButton}
          onPress={() => {
            // if (!userInfoData?.isChatUnLockBefore && level !== LEVEL.VIP) {
            //   setChatModal(true);
            // } else {
              dispatch(updateCurrentChatId(currentUserId));
              navigation.navigate('RoomChatScreen', {
                recipientId: currentUserId,
              });
            // }
          }}
          icon={mapIcon.chatIcon({
            size: 30,
            color: theme.colors.green,
          })}
        />
        <TouchableOpacity style={{ paddingRight: 16 }}></TouchableOpacity>
        <LikeButton
          buttonStyle={styles.floatButton}
          //style={[{paddingHorizontal: 10}]}
          onPress={() => setCollectionModal(true)}
          icon={mapIcon.starIcon({
            size: 30,
            color: isCollected ? theme.colors.yellow : theme.colors.black4,
          })}
        />
        <TouchableOpacity style={{ paddingRight: 16 }}></TouchableOpacity>
      </View>
    );
  };
  const handleBlock = async () => {
    if (isBlockUserInfoLoading) return;
    await blockUserInfo({ token, userId, blockUserId: currentUserId });
    Toast.show('用戶已封鎖');
  };
  const handleRemoveBlock = () => {
    if (isBlockUserInfoLoading) return;
    removeBlockInfo({ token, id: isBlockedId });
    Toast.show('用戶已解除封鎖');
  };
  const handleJoinVip = () => {
    navigation.push('PurchaseVIPScreen');
  };

  const HeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          position: 'absolute',
          top: 18,
          justifyContent: 'space-between',
          right: 0,
          left: 0,
        }}>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            position: 'absolute',
            top: 8,
            justifyContent: 'space-between',
            flexDirection: 'row',
            right: 0,
            left: 0,
          }}>
          {mapIcon.backIcon({ size: 30 })}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: 10,
            right: 0,
          }}>
          <TouchableOpacity onPress={onShare} style={{ paddingRight: 15 }}>
            {mapIcon.shareIcon()}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectModalShow(true);
            }}>
            {mapIcon.more()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        {/* <ConfirmChatModal
        isVisible={chatModal}
        onClose={() => setChatModal(false)}
        onPurchase={() => {
          navigation.push('PurchaseHeart');
          setChatModal(false);
        }}
        isChatUnLockBefore={userInfoData?.isChatUnLockBefore}
        recipientId={currentUserId}
        onConfirm={() => {
          dispatch(updateCurrentChatId(currentUserId));
          navigation.navigate('RoomChatScreen', {
            recipientId: currentUserId,
          });
          queryClient.invalidateQueries('fetchUserInfoById');
          setChatModal(false);
        }}
      />
      <CommonModalComponent
        isVisible={collectionModal}
        modalText={
          isCollected
            ? `要將 ${userInfoData?.name} 移出收藏嗎?`
            : `要將 ${userInfoData?.name} 加入收藏嗎?`
        }
        onConfirm={() => {
          handleLike();

          setCollectionModal(false);
        }}
        onClose={() => setCollectionModal(false)}
      />
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
      /> */}
      <VIPConnectLockModal isVisible={openLockVIP} onClose={()=>{setOpenLockVIP(false)}}/>
        <VIPModal
          isVisible={openVIP}
          textShow={true}
          titleText="升級VIP即可使用此功能"
          onClose={() => setOpenVIP(false)}
          onConfirmCallback={()=>{
            setTimeout(() => {
              setOpenVIP(false)
            }, 1000);
            setOpenLockVIP(true)
          }}
        />
        <SelectModal
          isVisible={selectModalShow}
          onDeletePress={()=>{
            setSelectModalShow(false);
            //@ts-ignore
            navigation.navigate('ReportScreen', {
              id: currentUserId,
              blockReportType: BLOCK_REPORT_TYPE.USER,
            });
          }}
          onSecondBtn={() => {
            setTimeout(() => {
              setOpenVIP(true);
            }, 700);
            setSelectModalShow(false);
          }}
          onClose={() => {
            setSelectModalShow(false);
          }}
        />
        <View style={{ marginBottom: 0, height: 370 }}>
          {HeaderView()}
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
            <Menu.Item
              style={{
                height: 32,
                borderBottomEndRadius: 20,
                paddingHorizontal: 5,

                borderBottomStartRadius: 20,
              }}
              onPress={() => {
                navigation.navigate('ReportScreen', {
                  id: currentUserId,
                  blockReportType: BLOCK_REPORT_TYPE.USER,
                });
                closeMenu();
              }}
              title={
                <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                  檢舉此用戶
                </CaptionFour>
              }
            />
          </Menu>
          <View style={{ height: 370, zIndex: -1 }}>
            <Carousel
              onSnapToItem={setActiveSlide}
              data={data}
              renderItem={renderItem}
              sliderWidth={width}
              itemWidth={width}
            />
          </View>
          {/* <Pagination
          dotsLength={data.length}
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
        /> */}
          {/* {renderFloatButtonContainer()} */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', top: -15 }}>
            {data.map((_e, i) => (
              <View
                key={i}
                style={{
                  width: 78,
                  height: 4,
                  borderRadius: 4,
                  backgroundColor: activeSlide === i ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  // marginLeft: i === 0 ? 0 : 6,
                  // marginBottom: 24,
                }}
              />
            ))}
          </View>
        </View>
        <View style={{ flex: 1, zIndex: -1 }}>
          <BioInfo userInfoData={userInfoData} />

          <TabView
            style={{
              marginTop: 10,
            }}
            renderTabBar={(props) => {
              return (
                <TabBar
                  {...props}
                  style={{
                    backgroundColor: theme.colors.black1,
                  }}
                  renderTabBarItem={(props) => {
                    return (
                      <TabBarItem
                        {...props}
                        style={{
                          position: 'relative',
                          zIndex: -1,
                          borderBottomColor: theme.colors.black3,
                          borderBottomWidth: 2,
                        }}
                      />
                    );
                  }}
                  contentContainerStyle={{}}
                  indicatorContainerStyle={{
                    zIndex: 1,
                  }}
                  indicatorStyle={{
                    // marginLeft: 10,
                    width: (width - 10) / 2,
                    backgroundColor: theme.colors.pink,
                  }}
                />
              );
            }}
            navigationState={{ index, routes }}
            renderScene={SceneMap({
              first: () => <AboutMe userInfoData={userInfoData} adjustHeight={adjustHeight} />,
              second: () => (
                <SearchAboutPost userInfoData={userInfoData} adjustHeight={adjustHeight} />
              ),
            })}
            // renderScene={SceneMap({
            //   first: () => <AboutMe userInfoData={userInfoData} adjustHeight={adjustHeight} />,
            //   second: () => <AboutPost userInfoData={userInfoData} adjustHeight={adjustHeight} />,
            //   third: () => <AboutPhoto userInfoData={userInfoData} adjustHeight={adjustHeight} />,
            // })}
            onIndexChange={setIndex}
          />
        </View>
        <ImageBackground
          source={matchBg}
          resizeMode="cover"
          style={{ width: '100%', height: 60, position: 'absolute', bottom: 0 }}>
          <TouchableOpacity
          onPress={handleLike}
            style={styles.likeIconStyle}>
            { isCollected ?  mapIcon.likeIcon({ color: theme.colors.pink, size: 28 }):mapIcon.unlikeIcon({ color: theme.colors.black4, size: 28 })}
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </>
  );
}
