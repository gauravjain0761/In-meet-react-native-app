import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme } from '@rneui/themed';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, CaptionFour, SubTitleTwo, TitleOne } from '../Text';
import { LikeButton } from '../Button';
import { mapIcon } from '../../../constants/IconsMapping';
import { CollectorUser, userApi } from '~/api/UserAPI';
import { getUserLike, getUserWatch, selectToken, selectUserId } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';
import { updateCurrentMatchingId } from '~/store/interestSlice';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { calculateAge } from '~/helpers/convertDate';
import { CITYEnum } from '~/constants/mappingValue';
import { UN_FILLED } from '~/constants/defaultValue';
import { color } from '@rneui/base';
import { hp } from '~/helpers/globalFunctions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    width: width * 0.93,
    height: height * 0.86,
    borderRadius: 20,
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    resizeMode: 'cover',
    // top: -60,
    marginTop: -(height * 0.0691),
    // left: -21,
    marginLeft: -(width * 0.05),
  },
  cardImage: {
    position: 'absolute',
    width: width * 0.93,
    height: height,
    resizeMode: 'contain',
    // borderRadius:20,
  },
  imageBg: {
    width: width * 0.93,
    height: 185,
    resizeMode: 'contain',
    paddingLeft: 16,
    top: height * 0.72,
  },
  linearGradient: {
    paddingRight: 6,
  },
  cardIntroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introText: {
    color: theme.colors?.white,
  },
  introTextHeader: {
    color: theme.colors?.white,
    backgroundColor: '#0ACFC3',
    width: 70,
    textAlign: 'center',
    padding: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  bioText: {
    maxWidth: '70%',
    paddingTop: 6,
    color: theme.colors?.white,
  },
  likeButtonContainer: {},
  cardBioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forDefaultAvatar: {
    position: 'absolute',
    right: '-10%',
    top: '-5%',
    width: '120%',
    height: '120%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    // marginEnd:0,
    // paddingEnd:0,
    // bottom: 0,
  },
  buttonStyle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: theme.colors.black1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
}));

interface Props {
  user?: User;
  favoriteList?: CollectorUser[];
  onPress?: () => void;
  onfavoritBtn?: () => void;
  onArrowPress?: () => void;
  onClosePress?: () => void;
  onLikePress?: () => void;
  refList?: any;
  index?: any;
}
export default function MatchCard(props: Props) {
  const {
    refList,
    user,
    favoriteList,
    onPress,
    onfavoritBtn,
    onArrowPress,
    onLikePress,
    onClosePress,
    index,
  } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { city, name, about, id, avatar, birthday } = user;
  console.log('user',user.id);
  
  const queryClient = useQueryClient();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isCollected = favoriteList?.map((record) => record.favoriteUser.id).includes(id);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [end, setEnd] = useState(0);
  // current is for get the current content is now playing
  const [current, setCurrent] = useState(0);
  // if load true then start the animation of the bars at the top
  const [load, setLoad] = useState(false);
  // progress is the animation value of the bars content playing the current state
  const progress = useRef(new Animated.Value(0)).current;
  const currentUserId = useSelector((state: RootState) => state.interest.currentMatchingId);
  const { data: avatarList } = useQuery(['fetchUserAvatars', id], () =>
    userApi.fetchUserAvatars({ token, id: id })
  );
  const { data: data, refetch } = useQuery(['fetchUserAvatars', id], () =>
    userApi.fetchUserLike({ token, id: id })
  );
  const { scrollvalue } = useSelector((state: RootState) => state.user);

  // const urlList =
  //   avatarList?.records.length !== 0 && avatarList
  //     ? avatarList?.records.map((record) => {
  //         return { ...record.fileInfoResponse, finish: 0 };
  //       })
  //     : avatar;
  // console.log('avatarList', content);

  const { mutate, isLoading } = useMutation(userApi.collectUser, {
    onSuccess: (data) => {
      const message = 'success';
    },
    onError: () => {
      // alert('there was an error');
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
        // alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('getFavoriteUser');
      },
    }
  );

  const handleLike = () => {
    if (!id || isLoading || removeLoading) {
      return;
    }
    if (isCollected) {
      const dataRecordIndex = favoriteList?.findIndex((item) => item.favoriteUser.id === id);
      const dataRecordId = get(favoriteList, `${dataRecordIndex}.id`, '');
      if (dataRecordId) {
        removeMutate({ token, dataRecordId });
      }
      return;
    }
    mutate({
      token,
      userId,
      favoriteUserId: id,
    });
  };

  return (
    <Pressable
      onPress={() => {
        if (id) {
          navigation.navigate('MatchingDetailScreen');
          dispatch(updateCurrentMatchingId(id));
        }
      }}
      style={styles.cardContainer}>
      <ImageBackground
        // resizeMethod="resize"
        resizeMode="cover"
        style={[
          styles.cardImage,
          { backgroundColor: avatar ? 'transparent' : theme.colors.black2 },
        ]}
        source={{ uri: avatar }}>
        <View style={styles.forDefaultAvatar}>
          {avatar ? null : <mapIcon.defaultAvatar color={'#8E8E8F'} />}
        </View>

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', top: '20%' }}>
          {Array.from(Array(4)).map((_e, i) => (
            <View
              key={i}
              style={{
                width: 78,
                height: 4,
                borderRadius: 4,
                backgroundColor: 0 === i ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                // marginLeft: i === 0 ? 0 : 6,
                // marginBottom: 24,
              }}
            />
          ))}
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            top: '20%',
    
            paddingHorizontal: 10,
          }}>
          {content?.length > 0 &&
            content?.map((index, key) => {
              return (
              
                <View
                  key={key}
                  style={{
                    height: 2,
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(117, 117, 117, 0.5)',
                    marginHorizontal: 2,
                  }}>
                  
                  <Animated.View
                    style={{
                      flex: current == key ? progress : content?.[key]?.finish,
                      height: 2,
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    }}
                  />
                </View>
              );
            })}
        </View> */}
        {scrollvalue > 100 && (
          <View
            style={{
              opacity: 1,
              transform: [{ rotate: '-30deg' }],
              position: 'absolute',
              top: height * 0.14,
              left: width * 0.06,
              zIndex: 1,
            }}>
            {refList?.current?.state?.firstCardIndex === index && mapIcon.likeIcon1({ size: 100 })}
          </View>
        )}
        {scrollvalue < -100 && (
          <Animated.View
            style={{
              opacity: 1,
              transform: [{ rotate: '30deg' }],
              position: 'absolute',
              top: height * 0.14,
              right: width * 0.05,
              zIndex: 1000,
            }}>
            {refList?.current?.state?.firstCardIndex === index &&
              mapIcon.unlikeIcon1({ size: 100 })}
          </Animated.View>
        )}

        <View style={[styles.linearGradient]}>
          <ImageBackground
            style={styles.imageBg}
            source={require('../../../assets/images/bottomBG.png')}>
            <View>
              <BodyThree style={styles.introTextHeader}>{'新用戶'} </BodyThree>
            </View>
            <View style={styles.cardIntroContainer}>
              <TitleOne style={styles.introText}>{name} </TitleOne>
              <SubTitleTwo style={styles.introText}>
                {calculateAge(birthday)} {get(CITYEnum, city, UN_FILLED)}
              </SubTitleTwo>
            </View>
            <View style={styles.cardBioContainer}>
              <CaptionFour numberOfLines={1} style={styles.bioText}>
                {about}
              </CaptionFour>
            </View>
            <View style={styles.footerBtnStyle}>
              <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
                {mapIcon.gobackIcon({ size: 22 })}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    getUserWatch({
                      token,
                      isLike: true,
                      id:id,
                    })
                  );
                  dispatch(getUserLike({ token, isLike: false, id: id }));
                  handleLike();
                  onClosePress();
                }}
                style={[styles.buttonStyle, { width: 85 }]}>
                {mapIcon.closeIcon({ size: 38 })}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    getUserWatch({
                      token,
                      isLike: true,
                      id:id,
                    })
                  );
                  dispatch(getUserLike({ token, isLike: true, id: id }));
                  handleLike();
                  onLikePress();
                }}
                style={[styles.buttonStyle, { width: 85 }]}>
                {mapIcon.likeIcon({ color: theme.colors.pink, size: 28 })}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (id) {
                    navigation.navigate('MatchingDetailScreen');
                    dispatch(updateCurrentMatchingId(id));
                  }
                }}
                style={[
                  styles.buttonStyle,
                  { backgroundColor: 'rgba(255, 255, 255, 0.60)', width: 40, height: 40 },
                ]}>
                {mapIcon.upIcon({})}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
