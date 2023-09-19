import {
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  StyleSheet,
  TextInput,
  InteractionManager,
  AsyncStorage,
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, makeStyles, useTheme } from '@rneui/themed';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Toast from 'react-native-root-toast';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Svg, { Path } from 'react-native-svg';
import { set } from 'lodash';
import { BodyThree, CaptionFive, SubTitleOne, TitleOne } from '../components/common/Text';
import { mapIcon } from '../constants/IconsMapping';
import { ButtonTypeTwo, LikeButton, UnChosenButton } from '../components/common/Button';
import SmallCard from '../components/common/Card/SmallCard';
import ModalComponent from '../components/common/ModalComponent';
import LoginGiftCard from '../components/common/Card/LoginGiftCard';
import { LandingScreenProps } from '../navigation/LandingNavigator';
import ConstellationCard from '../components/common/Card/ConstellationCard';
import { userApi, interestApi, paymentApi } from '~/api/UserAPI';
import userSlice, {
  patchUserAbout,
  patchUserEducation,
  patchUserHeight,
  patchUserInterests,
  patchUserJob,
  patchUserNotification,
  patchUserPoint,
  selectToken,
  updateUser,
  getUserLocation,
  getUserInfo,
} from '~/store/userSlice';
import Loader from '~/components/common/Loader';
import { RootState, useAppDispatch } from '~/store';
import { updateCurrentMatchingId } from '~/store/interestSlice';
import LandingModal from '~/components/common/LandingModal';
import useProfileHeight from '~/hooks/useProfileHeight';
import useProfileEducation from '~/hooks/useProfileEducation';
import {
  getIsFirst,
  getUserIsFromRegistered,
  storeUserIsDone,
  storeUserIsFifth,
  storeUserIsFirst,
  storeUserIsFourth,
  storeUserIsFromRegistered,
  storeUserIsSecond,
  storeUserIsThird,
  getNotificationHasShown,
  storeUserNotificationShown,
  storeUserToken,
} from '~/storage/userToken';
import BannerModal from '~/components/common/BannerModal';
import useFirebaseMessages from '~/hooks/useFirebaseMessages';
import { numberToDay, pointType } from '~/constants/mappingValue';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { calculateDays } from '~/helpers/convertDate';
import locationIcon from '../assets/images/icons/locationIcon.png';
import useRequestLocation from '~/hooks/useRequestLocation';
import FirstLoginModal from '~/components/common/FirstLoginModal';
import MatchCard from '~/components/common/Card/MatchCard';
import SwiperFlatList from 'react-native-swiper-flatlist';
import VIPModal from '~/components/common/VIPModal';
import VIPConnectModal from '~/components/common/VIPConnectModal';
import { fontSize } from '../helpers/Fonts';
import emptyImg from '../assets/images/icons/emptyImg.png';
import VerifiedModel from '~/components/common/VerifiedModel';
import MatchModal from '~/components/common/MatchModal';

const { height, width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors?.black1,
    // minHeight: height,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarNavText: {
    color: theme.colors?.white,
  },
  storiesContainer: {
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: theme.colors?.white,
  },
  firstImageContainer: {
    marginLeft: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  imageName: {
    textAlign: 'center',
    paddingTop: 2,
    color: theme.colors?.white,
    width: '100%',
  },

  cardWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardBanner: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },

  likeCount: {
    color: theme.colors?.black3,
    paddingLeft: 12,
  },

  dayTitle: {
    textAlign: 'center',
    paddingBottom: 6,
  },
  confirmContainer: {
    paddingTop: 4,
  },
  giftCardContainer: {
    alignItems: 'center',
    width: (width - 60 - 50 - 75) / 4,
    paddingBottom: 8,
  },
  modalWrapper: {
    flexGrow: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputStyle: {
    width: '100%',
    backgroundColor: theme.colors?.white,
    borderWidth: 1,
    borderColor: theme.colors?.black3,
    borderRadius: 20,
    height: '100%',
    padding: 20,
    paddingTop: 20,
    fontSize: 14,
    fontWeight: '300',
    textAlignVertical: 'top',
  },
  hintText: {
    paddingTop: 7,
    color: theme.colors?.black4,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  unchosenButtonText: {
    color: theme.colors?.black4,
  },
  cardView: {
    width: width * 0.93,
    height: height * 0.86,
    backgroundColor: theme.colors.black1,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  emptyWrapper: {
    backgroundColor: theme.colors?.black1,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
}));

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: 'black',
    backgroundColor: 'white',
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderRadius: 30,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    flex: 1,
    right: 5,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

export default function LandingScreen(props: LandingScreenProps) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>();
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const user = useSelector((state: RootState) => state.user);
  const { distance, interested, hobbyIds, endAge, startAge, id: userId } = user;
  const [selectedHeight, setSelectedHeight] = useState(undefined);
  const [selectedEducation, setSelectedEducation] = useState(undefined);
  const [selectedJobs, setSelectedJobs] = useState(undefined);
  const [selectedAboutMe, setSelectedAboutMe] = useState('');
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [heightOptions] = useProfileHeight();
  const [educationOptions] = useProfileEducation();

  const [firstLoginOpen, setFirstLoginOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vipConnectModal, setVipConnectModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const modalSeenRef = useRef({
    notificationSeen: 0,
    avatarSeen: 0,
    locationAsked: 0,
    loginSeen: 0,
  });
  const { requestUserPermission } = useFirebaseMessages();
  const [openLocationAsync] = useRequestLocation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const {
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetchError,
    fetchNextPage,
    hasNextPage,
    data,
  } = useInfiniteQuery(
    ['searchUserInLandingScreen', distance, interested, endAge, startAge, hobbyIds],
    (pageObject) =>
      userApi.fetchUser({ token, gender: interested, hobbyId: hobbyIds, distance }, pageObject),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page.totalPage !== lastPage.page.currentPage) {
          return lastPage.page.currentPage + 1;
        }
        return undefined;
      },
      retry: 2,
      retryDelay: 3000,
    }
  );
  const { data: interestList } = useQuery(
    'fetchUserByInterest',
    () => interestApi.fetchAllInterest({ token, hobbyName: '', limit: 100 }, {}),
    {
      refetchOnMount: true,
    }
  );

  const { data: favoriteList } = useQuery('getFavoriteUser', () =>
    userApi.getFavoriteUser({ token })
  );

  const users = data?.pages.map((page) => page.records).flat();
  const handlePressStory = (id: number) => {
    if (id) {
      navigation.push('MatchingDetailScreen');
      dispatch(updateCurrentMatchingId(id));
    }
  };

  const handlePressConstellationCard = () => {
    navigation.push('ConstellationSearchScreen');
  };

  const handlePressFilter = () => {
    navigation.navigate('FilterSearchScreen');
  };
  const handleDicoverScreen = () => {
    navigation.navigate('DicoverScreen');
  };

  const renderRow = ({ item }) => (
    <MatchCard
      user={item}
      favoriteList={favoriteList?.records}
      onPress={() => {
        setVipConnectModal(true);
      }}
      onfavoritBtn={() => setShowVerifiedModal(true)}
      onArrowPress={()=>setShowMatchModal(true)}
    />
  );

  const renderListHeaderComponent = () => {
    return (
      <>
        <View style={styles.header}>
          <View />
          <BodyThree style={styles.topBarNavText}>推薦給您</BodyThree>
          <Pressable onPress={handlePressFilter}>{mapIcon.filterIcon()}</Pressable>
        </View>
        <ScrollView
          style={styles.storiesContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {users?.slice(0, 4).map((user, index) => (
            <TouchableOpacity
              key={user.id}
              onPress={() => handlePressStory(user.id)}
              style={[styles.imageContainer, index === 0 && styles.firstImageContainer]}>
              <Image
                style={styles.image}
                source={user.avatar ? { uri: user.avatar } : defaultAvatar}
              />
              <CaptionFive style={styles.imageName}>{user.name}</CaptionFive>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.cardBanner}>
          <ConstellationCard onPress={handlePressConstellationCard} />
        </View>
      </>
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyWrapper}>
        <Text
          style={{
            color: theme.colors.black4,
            textAlign: 'center',
            fontSize: fontSize(16),
            lineHeight: 25,
            fontFamily: 'roboto',
          }}>
          附近沒有更多的人了
        </Text>
        <Image style={{ width: 180, height: 180, marginVertical: 24 }} source={emptyImg} />
        <Text
          style={{
            color: theme.colors.black4,
            textAlign: 'center',
            fontSize: fontSize(14),
            lineHeight: 25,
            fontFamily: 'roboto',
          }}>
          {'增加搜索城市即可獲得更多配對機會'}
        </Text>
      </View>
    );
  };

  const handleConfirm = async () => {
    try {
      const deviceToken = await requestUserPermission();
      if (deviceToken) {
        await dispatch(patchUserNotification({ deviceToken })).unwrap();
        setNotificationModal(false);
        setCurrentStep(currentStep + 1);
      } else {
        if (Platform.OS === 'android') {
          await Linking.openSettings();
        }
        if (Platform.OS === 'ios') {
          await Linking.openURL('app-settings:');
        }
      }
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  const locationConfirm = async () => {
    try {
      const { status } = await (await Location.requestForegroundPermissionsAsync()).canAskAgain;
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        if (Platform.OS === 'android') {
          await Linking.openSettings();
        }
        if (Platform.OS === 'ios') {
          await Linking.openURL('app-settings:');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // currentIndex == 0 && setFirstLoginOpen(true);

    const fromRegistered = async () => {
      const isFromRegistered = await getUserIsFromRegistered();
      if (isFromRegistered === 'isFromRegistered') {
        console.log('isFromRegistered: ', isFromRegistered);
        setRegisterModal(true);
        setFirstLoginOpen(true);
        await storeUserIsFromRegistered('');
      } else {
        setRegisterModal(false);
      }
    };
    const locationCheck = async () => {
      const { latitude, longitude } = await openLocationAsync({ updateRegister: true });
      if (!latitude) {
        setLocationModal(true);
        const res = await dispatch(getUserInfo({})).unwrap();

        setCurrentUserData(res);
        return res.data.deviceToken;
      }
      setLocationModal(false);
      const res = await dispatch(
        getUserLocation({ token, lat: latitude, lng: longitude })
      ).unwrap();

      setCurrentUserData(res);
      return res.data.deviceToken;
    };
    const notificationCheck = async (deviceToken?: string) => {
      const notificationAuthStatus = await messaging().hasPermission();
      if (notificationAuthStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
        setNotificationModal(true);
        Toast.show('通知設定已關閉，請至設定開啟通知。');
      } else {
        const notificationToken = await messaging().getToken();

        if (deviceToken !== notificationToken) {
          setNotificationModal(true);
          return;
        }
        setNotificationModal(false);
      }
    };
    const checkLogin = async () => {
      if (currentUserData.data.isGetLoginReward === false) {
        setLoginModal(true);
      } else {
        setLoginModal(false);
      }
    };
    const checkAvatar = async () => {
      if (!currentUserData.data.avatar || currentUserData.data.avatar === undefined) {
        setAvatarModal(true);
      } else {
        setAvatarModal(false);
      }
    };
    if (currentStep === 0) {
      fromRegistered().then(() =>
        locationCheck().then((deviceToken) =>
          notificationCheck(deviceToken).then(() => setCurrentStep(currentStep + 1))
        )
      );
    } else if (currentStep === 1) {
      checkLogin().then(() => checkAvatar().then(() => setCurrentStep(currentStep + 1)));
    } else if (currentStep === 2) {
      setCurrentStep(currentStep + 1);
    } else if (registerModal && currentStep === 3) {
    } else if (locationModal && currentStep === 4) {
    } else if (notificationModal && currentStep === 5) {
    } else if (loginModal && currentStep === 6) {
    } else if (avatarModal && currentStep === 7) {
    } else if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ marginRight: 20 }} />
        {mapIcon.logoIcon({ size: 36 })}
        <Pressable onPress={handleDicoverScreen}>{mapIcon.pagesIcon({ size: 24 })}</Pressable>
      </View>
      <View style={styles.cardView}>
        <SwiperFlatList
          contentContainerStyle={{ flex: users?.length == 0 ? 1 : 0 }}
          // numColumns={1}
          // style={{ flex: 1 }}
          // horizontal¯
          vertical={true}
          onEndReached={() => {
            if (hasNextPage && !isRefetchError) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.1}
          data={users?.slice(4)}
          // columnWrapperStyle={styles.cardWrapper}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={renderRow}
          // ListHeaderComponent={renderListHeaderComponent()}
          ListEmptyComponent={renderListEmptyComponent()}
          // ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        />
      </View>
      <BannerModal
        animationType="slide"
        transparent
        modalTitle="開啟推播通知"
        button2Title="略過"
        buttonTitle="開啟"
        modalSubTitle="有會員想要聯絡你時，不會錯過任何最新訊息"
        onConfirm={() => {
          handleConfirm();
        }}
        onCloseModal={() => {
          console.log('currentStep: ', currentStep);

          setCurrentStep(currentStep + 1);
          setNotificationModal(false);
        }}
        modalVisible={currentStep == 5 && notificationModal}>
        <Icon name="notifications-active" size={80} color="#FFD809" />
      </BannerModal>
      <FirstLoginModal
        animationType="slide"
        transparent
        onCloseModal={() => {
          setFirstLoginOpen(false);
          setCurrentIndex(1);
        }}
        modalVisible={firstLoginOpen}
      />
      <BannerModal
        animationType="slide"
        transparent
        modalTitle="開啟定位"
        button2Title="略過"
        buttonTitle="開啟"
        modalSubTitle="開啟定位時，系統將搜索附近的會員 (未開啟定位時，則自動推薦居住地區的會員)"
        onConfirm={() => {
          locationConfirm().then(() => {
            setCurrentStep(currentStep + 1);
            setLocationModal(false);
          });
        }}
        onCloseModal={() => {
          console.log('currentStep: ', currentStep);
          setCurrentStep(currentStep + 1);
          setLocationModal(false);
        }}
        modalVisible={currentStep == 4 && locationModal}>
        {mapIcon.locationIcon({ color: '#A259FF', size: 80 })}
      </BannerModal>
      {/* modal */}
      <ModalComponent
        animationType="slide"
        transparent
        modalVisible={currentStep == 3 && registerModal}
        onCloseModal={() => {
          setCurrentStep(currentStep + 1);
          setRegisterModal(false);
        }}
        modalTitle="註冊好禮"
        modalSubtitle="謝謝您註冊InMeet，送給您12顆愛心！"
        buttonTitle="確定">
        {mapIcon.likeIcon({ color: theme.colors.pink, size: 60 })}
        <TitleOne style={styles.likeCount}>x12</TitleOne>
      </ModalComponent>
      <ModalComponent
        animationType="slide"
        transparent
        modalVisible={currentStep == 6 && loginModal}
        onCloseModal={() => {
          setCurrentStep(currentStep + 1);
          setLoginModal(false);
        }}
        modalTitle="登入好禮"
        modalSubtitle="登入即可獲得登入好禮！"
        buttonTitle="確定">
        {mapIcon.likeIcon({ color: theme.colors.pink, size: 60 })}
        <TitleOne style={styles.likeCount}>x3</TitleOne>
      </ModalComponent>
      <VIPConnectModal isVisible={vipConnectModal} onClose={() => setVipConnectModal(false)} />
      <VerifiedModel isVisible={showVerifiedModal} onClose={() => setShowVerifiedModal(false)} />
      <MatchModal isVisible={showMatchModal} onClose={() => setShowMatchModal(false)} />
    </SafeAreaView>
  );
}
