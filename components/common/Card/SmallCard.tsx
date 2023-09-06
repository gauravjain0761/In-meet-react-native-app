import { View, Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme } from '@rneui/themed';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, CaptionFour, SubTitleTwo } from '../Text';
import { LikeButton } from '../Button';
import { mapIcon } from '../../../constants/IconsMapping';
import { CollectorUser, userApi } from '~/api/UserAPI';
import { selectToken, selectUserId } from '~/store/userSlice';
import { useAppDispatch } from '~/store';
import { updateCurrentMatchingId } from '~/store/interestSlice';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { calculateAge } from '~/helpers/convertDate';
import { CITYEnum } from '~/constants/mappingValue';
import { UN_FILLED } from '~/constants/defaultValue';
import { color } from '@rneui/base';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  cardContainer: {
    height: 240,
    width: (width - 32 - 13) / 2,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  linearGradient: {
    height: '27%',
    top: '73%',
    paddingLeft: 10,
    paddingRight: 6,
  },
  cardIntroContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  introText: {
    color: theme.colors?.white,
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
    right:'-10%',
    top:'-5%',
    width: '120%',
    height: '120%',
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    // alignItems: 'flex-end',
    // marginEnd:0,
    // paddingEnd:0,
    // bottom: 0,
  }
}));

interface Props {
  user: User;
  favoriteList?: CollectorUser[];
}
export default function SmallCard(props: Props) {
  const { user, favoriteList } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { city, name, about, id, avatar, birthday } = user;
  const queryClient = useQueryClient();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isCollected = favoriteList?.map(record => record.favoriteUser.id).includes(id);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { mutate, isLoading } = useMutation(userApi.collectUser, {
    onSuccess: data => {
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
      onSuccess: data => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('getFavoriteUser');
      },
    },
  );

  const handleLike = () => {
    if (!id || isLoading || removeLoading) {
      return;
    }
    if (isCollected) {
      const dataRecordIndex = favoriteList?.findIndex(item => item.favoriteUser.id === id);
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
    <TouchableOpacity
      onPress={() => {
        if (id) {
          navigation.navigate('MatchingDetailScreen');
          dispatch(updateCurrentMatchingId(id));
        }
      }}
      style={styles.cardContainer}>
      
      <ImageBackground style={styles.cardImage} source={ {uri: avatar} }>
        <View style={styles.forDefaultAvatar}>
          {avatar ? null :<mapIcon.defaultAvatar color={'#8E8E8F'}/>}
          </View>
        <LinearGradient
          style={styles.linearGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          locations={[0, 0.5721, 1]}
          colors={['#4A4D5A', 'rgba(74, 77, 90, 0.476938)', 'rgba(74, 77, 90, 0)']}>
          <View style={styles.cardIntroContainer}>
            <SubTitleTwo style={styles.introText}>{name} </SubTitleTwo>
            <BodyThree style={styles.introText}>
              {calculateAge(birthday)} {get(CITYEnum, city, UN_FILLED)}
            </BodyThree>
          </View>
          <View style={styles.cardBioContainer}>
            <CaptionFour numberOfLines={2} style={styles.bioText}>
              {about}
            </CaptionFour>
            <LikeButton
              onPress={handleLike}
              icon={mapIcon.starIcon({
                color: isCollected ? theme.colors.yellow : theme.colors.black4,
                size: 15,
              })}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
