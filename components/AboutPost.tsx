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

const { width } = Dimensions.get('window');
interface IAboutME {
  adjustHeight: (value: number) => void;
  userInfoData?: User;
}

const useStyles = makeStyles(theme => ({
  text: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  rowTitle: { color: theme.colors?.white, width: 60 },
  personalTitle: {
    color: theme.colors?.black4,
    paddingTop: 20,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  interestChipContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 10,
  },
  interestButtonContainer: {
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  interestButton: { width: (width - 96) / 5, height: 18, padding: 0 },
  interestButtonTitle: {
    color: theme.colors?.black4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bottomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
}));

export default function AboutPost(props: IAboutME) {
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
  const {id} = useSelector((state: RootState) => state.user);
  const { data: blogList } = useQuery(['fetchUserBlogs', id], () =>
    userApi.fetchUserBlogs({ token, id: id }),
  );
  
  const { mutate: unLockPrivatePhoto, isLoading: isUnLockLoading } = useMutation(
    userApi.unLockPrivatePost,
    {
      onSuccess: data => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        dispatch(getUserInfo({}));
        queryClient.invalidateQueries('fetchUserBlogs');
      },
    },
  );

  const handlePressImage = (isLocked: boolean, item = {}) => {
    if (isLocked) return;
    const { blogId } = item;
    if (blogId) {
      dispatch(updateCurrentId(blogId));
      navigation.navigate('ForumDetailScreen');
    }
  };

  const renderItem = (item: Blog) => {
    const { photo } = item;
    const { isUnLockBefore } = item;

    const isLocked = item.isHidden;
    const canNotSee = isLocked && !isUnLockBefore;
    return (
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={() => handlePressImage(canNotSee, { blogId: item.id })}
          activeOpacity={canNotSee ? 1 : 0.2}>
          <Image
            blurRadius={canNotSee ? 20 : 0}
            style={styles.image}
            source={{
              uri:
                get(photo?.split(','), '[0]', '') ||
                `https://via.placeholder.com/200x300?text=Default`,
            }}
          />
        </TouchableOpacity>

        {isLocked && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -25 }, { translateY: -50 }],
            }}>
            {mapIcon.lockIcon({ color: 'white', size: 50 })}
            {canNotSee && (
              <UnChosenButton
                onPress={() => {
                  setCurrentSelectedId(item.id);
                  setChatModal(true);
                }}
                buttonStyle={{ height: 25, padding: 0 }}
                titleStyle={{ fontSize: 12 }}
                title="查看"
              />
            )}
          </View>
        )}
      </View>
    );
  };
  return (
    <Loader isLoading={isUnLockLoading}>
      <View style={{ flex: 1 }}>
        {blogList?.records.length !== 0 && (
          <ScrollView
            style={{
              width: '100%',
              paddingTop: 20,
              paddingHorizontal: 16,
            }}>
            <Row rowStyles={{ marginRight: -20 }}>
              {blogList?.records.map(item => (
                <Col colStyles={{ paddingRight: 20 }} key={item.id} xs={4} sm={4} md={4} lg={4}>
                  {renderItem(item)}
                </Col>
              ))}
            </Row>
          </ScrollView>
        )}
        {blogList?.records.length === 0 && (
          <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <SubTitleOne style={{ textAlign: 'center', ...styles.interestButtonTitle }}>
              {name} 尚未發布任何動態
            </SubTitleOne>
          </View>
        )}
      </View>
      <ConfirmUnLockPhotoModal
        isVisible={chatModal}
        title="要查看私密動態嗎？"
        onClose={() => setChatModal(false)}
        onPurchase={() => {
          navigation.push('PurchaseHeart');
          setChatModal(false);
        }}
        onConfirm={() => {
          if (isUnLockLoading) return;
          if (!currentSelectedId) return;
          unLockPrivatePhoto({ token, id: currentSelectedId });
          setChatModal(false);
        }}
      />
    </Loader>
  );
}
