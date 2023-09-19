import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SectionList,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { Row, Col } from 'react-native-responsive-grid-system';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { get } from 'lodash';
import { BodyThree, CaptionFour, SubTitleOne } from './common/Text';
import { UnChosenButton } from './common/Button';
import { mapIcon } from '~/constants/IconsMapping';
import { RootState, useAppDispatch } from '~/store';
import { Blog, updateCurrentId } from '~/store/forumSlice';
import { getUserInfo, selectToken } from '~/store/userSlice';
import { FileRecord, userApi } from '~/api/UserAPI';
import Loader from './common/Loader';
import ConfirmUnLockPhotoModal from './common/ConfirmUnLockPhotoModal';
import { fontSize } from '~/helpers/Fonts';

const { width } = Dimensions.get('window');
interface IAboutME {
  adjustHeight: (value: number) => void;
  userInfoData?: User;
}

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    height: 250,
    width: (width - 32 - 10) / 2,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: theme.colors.black2,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: (width - 32 - 10) / 2,
    height: 167,
  },
  textStyle: {
    marginTop: 8,
    color: theme.colors.white,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textfavorite: {
    color: theme.colors.white,
    marginLeft: 5,
  },
}));

export default function SearchAboutPost(props: IAboutME) {
  const { adjustHeight, userInfoData = {} } = props;
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { name } = userInfoData;
  const currentUserId = useSelector((state: RootState) => state.interest.currentMatchingId);
  const token = useSelector(selectToken);
  const [chatModal, setChatModal] = useState(false);
  const queryClient = useQueryClient();
  const [currentSelectedId, setCurrentSelectedId] = useState(0);
  const { data: blogList } = useQuery(['fetchUserBlogs', currentUserId], () =>
    userApi.fetchUserBlogs({ token, id: currentUserId })
  );

  const { mutate: unLockPrivatePhoto, isLoading: isUnLockLoading } = useMutation(
    userApi.unLockPrivatePost,
    {
      onSuccess: (data) => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        dispatch(getUserInfo({}));
        queryClient.invalidateQueries('fetchUserBlogs');
      },
    }
  );

  const handlePressImage = (isLocked: boolean, item = {}) => {
    if (isLocked) return;
    const { blogId } = item;
    if (blogId) {
      dispatch(updateCurrentId(blogId));
      navigation.navigate('ForumDetailScreen');
    }
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        {mapIcon.tabViewBgIcon({ size: 100 })}
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: fontSize(16),
            lineHeight: 25,
            fontFamily: 'roboto',
          }}>
          {'Sarah 尚未發布任何動態'}
        </Text>
      </View>
    );
  };

  return (
    // <Loader isLoading={isUnLockLoading}>
    <View style={{ marginTop: 10 }}>
      <FlatList
         data={[0, 1, 2,3,4,5]}
    
        numColumns={2}
        columnWrapperStyle={styles.cardWrapper}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={() => {
          return (
            <View style={styles.cardContainer}>
              <Image
                source={{ uri: 'https://picsum.photos/id/231/200/300' }}
                resizeMode="cover"
                style={styles.imageStyle}
              />
              <CaptionFour style={styles.textStyle}>
                {'路跑美乞條追，斤升支杯語帶左蛋戶包呀送「那像請...'}
              </CaptionFour>
              <View style={[styles.footerCard, { alignSelf: 'center', marginTop: 8 }]}>
                <TouchableOpacity style={[styles.footerCard, { marginRight: 20 }]}>
                  {mapIcon.favoriteIcon({ size: 20 })}
                  <BodyThree style={styles.textfavorite}>1290</BodyThree>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerCard}>
                  {mapIcon.commentIcon({ size: 20 })}
                  <BodyThree style={styles.textfavorite}>0</BodyThree>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>

    // </Loader>
  );
}
