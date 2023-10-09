import {
  View,
  Text,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import {
  BodyThree,
  BodyTwo,
  CaptionFive,
  CaptionFour,
  SubTitleOne,
  SubTitleTwo,
  TitleOne,
  TitleTwo,
} from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ButtonTypeTwo, UnChosenButton } from '../../components/common/Button';
import ProfileRowItem from '../../components/Profile/ProfileRowItem';
import ProfileBodyColumn from '../../components/Profile/ProfileBodyColumn';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import { getUserInfo } from '../../store/userSlice';
import { RootState, useAppDispatch } from '../../store';
import { UN_KNOWN } from '~/constants/defaultValue';
import CommonModalComponent from '~/components/common/CommonModalComponent';
import { calculateExpiredDate } from '~/helpers/convertDate';
import ProfileHeaderNew from '~/components/Profile/ProfileHeaderNew';
import { fontSize } from '~/helpers/Fonts';
import ProfileRowItemNew from '~/components/Profile/ProfileRowItemNew';

const { width, height: WindowHeight } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  moreStyle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.black3,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 16,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  headerInfoContainer: {
    alignSelf: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: theme.colors?.white,
    borderRadius: 120,
  },
  bodyContainer: {
    paddingTop: 10,
    width: 160,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    marginTop: 20,
    marginHorizontal:24,
    borderRadius:18,
    paddingVertical:12,
    backgroundColor:theme.colors.black2
  },

  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
    marginLeft:20
  },
  centeredView: {
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 25,
    paddingBottom: 16,
  },

  modalSubtitle: {
    paddingVertical: 20,
    textAlign: 'center',
    flexGrow: 1,
    color: theme.colors?.black3,
  },

  likeCount: {
    color: theme.colors?.black3,
    paddingLeft: 12,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  description: {
    color: theme.colors?.black4,
    flex: 1,
  },
  vipCardStyle: {
    width: width - 42,
    height: 195,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  vipHeaderText: {
    color: theme.colors.white,
  },
  vipText: {
    color: theme.colors.white,
    fontSize: fontSize(14),
    fontFamily: 'roboto',
    fontWeight:'400'
  },
  vipBtnStyle: {
    width: 110,
    height: 40,
    backgroundColor: theme.colors.pink,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
}));

export default function ProfileLandingScreen(
  props: ProfileStackScreenProps<'ProfileLandingScreen'>
) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { top, bottom } = useSafeAreaInsets();

  const { name, signature, point, starAmount, height, job, education, hobbies, about, vipEndTime } =
    useSelector((state: RootState) => state.user);

  // const dataRow = [
  //   {
  //     title: '加入VIP',
  //     titleStyle: styles.defaultTitle,
  //     rightIcon: mapIcon.diamondIcon(),
  //     description: calculateExpiredDate(vipEndTime),
  //     descriptionStyle: styles.description,
  //     onPress: () => {
  //       navigation.push('PurchaseVIPScreen');
  //     },
  //   },
  //   {
  //     title: '個人資料',
  //     titleStyle: styles.defaultTitle,
  //     rightIcon: mapIcon.personalIcon(),
  //     onPress: () => {
  //       // ProfileDetail is at root
  //       navigation.push('ProfileDetail');
  //     },
  //   },
  //   {
  //     title: '設定',
  //     titleStyle: styles.defaultTitle,
  //     rightIcon: mapIcon.settingIcon(),
  //     onPress: () => {
  //       navigation.push('ProfileSettingScreen');
  //     },
  //   },
  //   {
  //     title: '幫助',
  //     titleStyle: styles.defaultTitle,
  //     rightIcon: mapIcon.inquiryIcon(),
  //     onPress: () => {
  //       navigation.push('ProfileHelpScreen');
  //     },
  //   },
  //   {
  //     title: '聯絡我們',
  //     titleStyle: styles.defaultTitle,
  //     rightIcon: mapIcon.contactIcon(),
  //     onPress: () => {
  //       navigation.push('ContactUsScreen');
  //     },
  //   },
  //   // {
  //   //   title: '即時客服聊天室',
  //   //   titleStyle: styles.defaultTitle,
  //   //   rightIcon: mapIcon.chatIcon(),
  //   //   onPress: () => {
  //   //     navigation.push('HelperRoomChatScreen');
  //   //   },
  //   // },
  // ];


const NewData=[
  {
    title: '我的生活照',
    titleStyle: styles.defaultTitle,
    rightIcon: mapIcon.photoIcon1({color:theme.colors.white}),
    descriptionStyle: styles.description,
    onPress: () => {
      navigation.navigate('EditProfilePhoto');
    },
    
  },
  {
    title: '個人資料',
    titleStyle: styles.defaultTitle,
    rightIcon: mapIcon.userIcon(),
    onPress: () => {
      // ProfileDetail is at root
      navigation.push('ProfileDetail');
    },
  },
  {
    title: '配對篩選',
    titleStyle: styles.defaultTitle,
    rightIcon: mapIcon.filterIcon1({color:theme.colors.white}),
    onPress: () => {
      // ProfileDetail is at root
      navigation.navigate('FilterSearchScreen');

    },
  },
  {
    title: '我的動態',
    titleStyle: styles.defaultTitle,
    rightIcon: mapIcon.livePhotoIcon({color:theme.colors.white}),
    onPress: () => {
      // ProfileDetail is at root
      navigation.push('MyUpdateScreen');
    },
  },
]
const secondData=[
  {
    title: '設定',
    titleStyle: styles.defaultTitle,
    rightIcon: mapIcon.settingsIcon({color:theme.colors.white}),
    onPress: () => {
      navigation.push('ProfileSettingScreen');
    },
  },
  // {
  //   title: '聯絡我們',
  //   titleStyle: styles.defaultTitle,
  //   rightIcon: mapIcon.inemailIcon(),
  //   onPress: () => {
  //     navigation.push('ContactUsScreen');
  //   },
  // },
]

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserInfo({}));
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '',
      headerRight: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={styles.moreStyle}>
          {mapIcon.more({ size: 24 })}
        </TouchableOpacity>
      ),
    });
  });

  const [modalVisible, setModalVisible] = useState(false);
  useFocusEffect(() => {
    if (!about || !height || !job || !education || !hobbies || isEmpty(hobbies)) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  });
  const VipContainer = () => {
    return (
      <ImageBackground source={mapIcon.VIPcard} resizeMode="cover" style={styles.vipCardStyle}>
        <TitleTwo style={styles.vipHeaderText}>{'升級VIP會員'}</TitleTwo>
        <SubTitleOne style={[styles.vipHeaderText, { fontWeight: '400' }]}>
          {'享受到更快速的配對體驗'}
        </SubTitleOne>
        <View style={{ flexDirection: 'row', marginTop: 18,alignItems:'center' }}>
          <View style={{flex:1}}>
            <BodyTwo style={styles.vipHeaderText}>收費方式：</BodyTwo>
            <SubTitleTwo style={[styles.vipHeaderText, { fontWeight: '700' }]}>
              {'$290/月'}
            </SubTitleTwo>
          </View>
          <TouchableOpacity style={styles.vipBtnStyle} onPress={() => {navigation.push('VIPPurchaseScreen')}}>
            <Text style={styles.vipText}>了解更多</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: bottom }]}>
      <ScrollView style={[styles.container, { top: -10 }]}>
        <ProfileHeaderNew headerStyle={{}} />
        <VipContainer />
        {/* <View style={styles.bodyContainer}>
          <ProfileBodyColumn
            buttonText="查看"
            onPress={() => {
              navigation.push('CollectionScreen');
            }}
            icon={mapIcon.starIcon({ color: theme.colors.yellow, size: 15 })}
            count={starAmount}
            title="誰收藏我"
          />
          <ProfileBodyColumn
            buttonText="追加"
            icon={mapIcon.likeIcon({ color: theme.colors.pink, size: 15 })}
            count={point}
            onPress={() => {
              navigation.push('PurchaseHeart');
            }}
            title="剩餘的愛心"
          />
        </View> */}
        {/* {modalVisible && (
          <View
            style={{
              width: '100%',
            }}>
            <View style={styles.modalWrapper}>
              <View style={styles.centeredView}>
                <BodyThree style={styles.modalSubtitle}>
                  充足您的個人資訊，填寫身高、職業、學歷、與興趣、自我介紹，完成即可獲得15顆愛心！
                </BodyThree>
                <ButtonTypeTwo
                  onPress={() => {
                    setModalVisible(false);
                    navigation.push('ProfileDetail');
                  }}
                  buttonStyle={{
                    paddingHorizontal: 32,
                  }}
                  style={{
                    alignSelf: 'center',
                  }}
                  title="開始填寫"
                />
              </View>
            </View>
          </View>
        )} */}
        <View style={styles.footerContainer}>
          {NewData.map((item) => (
            <ProfileRowItemNew
            showIcon={true}
              key={item.title}
              title={item.title}
              titleStyle={item.titleStyle}
              rightIcon={item.rightIcon}
              onPress={item.onPress}
              // description={item.description}
              descriptionStyle={item.descriptionStyle}
            />
          ))}
        </View>
        <View style={styles.footerContainer}>
          {secondData.map((item) => (
            <ProfileRowItemNew
             showIcon={true}
              key={item.title}
              title={item.title}
              titleStyle={item.titleStyle}
              rightIcon={item.rightIcon}
              onPress={item.onPress}
              // description={item.description}
              descriptionStyle={item.descriptionStyle}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
