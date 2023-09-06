import { View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { CaptionFour, SubTitleOne } from './common/Text';
import { UnChosenButton } from './common/Button';
import { mapIcon } from '~/constants/IconsMapping';
import { FileRecord, userApi } from '~/api/UserAPI';
import { getUserInfo, selectToken, selectUserId } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';
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
    width: '45%',
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

enum LEVEL {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

export default function AboutPhoto(props: IAboutME) {
  const { adjustHeight, userInfoData = {} } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { name } = userInfoData;
  const queryClient = useQueryClient();
  const userId = useSelector(selectUserId);
  const currentUserId = useSelector((state: RootState) => state.interest.currentMatchingId);
  const token = useSelector(selectToken);
  const level = useSelector((state: RootState) => state.user.level);
  
  const navigation = useNavigation();
  const [chatModal, setChatModal] = useState(false);
  const dispatch = useAppDispatch();
  const [currentSelectedId, setCurrentSelectedId] = useState(0);

  const { data: photoList } = useQuery('fetchUserPhotos', () =>
    userApi.fetchUserPhotos({ token, id: currentUserId }),
  );

  const { mutate: likePhoto, isLoading: isLikeLoading } = useMutation(userApi.likePhoto, {
    onSuccess: data => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      dispatch(getUserInfo({}));

      queryClient.invalidateQueries('fetchUserPhotos');
    },
  });
  const { mutate: unLockPrivatePhoto, isLoading: isUnLockLoading } = useMutation(
    userApi.unLockPrivatePhoto,
    {
      onSuccess: data => {
        const message = 'success';
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        queryClient.invalidateQueries('fetchUserPhotos');
      },
    },
  );

  const { mutate: unLikePhoto, isLoading: isUnLikeLoading } = useMutation(userApi.unLikePhoto, {
    onSuccess: data => {
      const message = 'success';
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('fetchUserPhotos');
    },
  });
  const handlePressImage = (isLocked: boolean) => {
    if (isLocked && level !== LEVEL.VIP) return;

    navigation.navigate('ImageGalleryScreen', {
      images: photoList?.records
        .filter(item => !item.isHidden)
        .filter(item => level === LEVEL.VIP ||(!item.isLock || item.isUnLockBefore))
        .map(record => ({
          id: record.id,
          url: record.fileInfoResponse.url,
          point: record.amount,
          isLock: record.isLock,
          userId: record.userId,
          isLikeBefore:record.isLikeBefore,
          isUnLockBefore: record.isUnLockBefore
        })),
    });
  };

  const handlePressLike = async (item: FileRecord) => {
    try {
      if (!item.id) throw item;
      if (currentUserId === userId) throw new Error('cannot  be same user');
      if (isUnLikeLoading || isLikeLoading) return;
      if (item.isLock && !item.isUnLockBefore && level !== LEVEL.VIP) return;
      if (item.isLikeBefore) {
        unLikePhoto({ token, id: item.id });
        return;
      }
      likePhoto({ token, id: item.id });
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  const renderItem = (item: FileRecord) => {
    const { isUnLockBefore } = item;

    const isLocked = item.isLock;
    const canNotSee = level !== LEVEL.VIP && isLocked && !isUnLockBefore;
    return (
      <View key={item.id} style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={() => {
            handlePressImage(canNotSee);
          }}
          activeOpacity={canNotSee ? 1 : 0.2}>
          <Image
            blurRadius={canNotSee ? 20 : 0}
            style={styles.image}
            source={{ uri: item.fileInfoResponse.url }}
          />
        </TouchableOpacity>

        <View style={styles.bottomWrapper}>
          <TouchableOpacity onPress={() => handlePressLike(item)}>
            {item?.isLikeBefore
              ? mapIcon.likeIcon({
                  size: 20,
                  color: theme.colors.pink,
                })
              : mapIcon.heartOutlineIcon({ color: theme.colors.black4, size: 20 })}
          </TouchableOpacity>
          <CaptionFour style={{ color: 'white', paddingLeft: 5 }}>{item?.amount || 0}</CaptionFour>
        </View>
        {isLocked && level !== LEVEL.VIP && (
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
    <View style={{ flex: 1 }}>
      {photoList?.records.length !== 0 && (
        <ScrollView style={{ width: '100%', paddingTop: 20, paddingHorizontal: 16 }}>
          <View style={styles.cardWrapper}>{photoList?.records.map(renderItem)}</View>
        </ScrollView>
      )}

      {photoList?.records.length === 0 && (
        <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <SubTitleOne style={{ textAlign: 'center', ...styles.interestButtonTitle }}>
            {name} 尚未發布任何相簿
          </SubTitleOne>
        </View>
      )}
      <ConfirmUnLockPhotoModal
        isVisible={chatModal}
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
    </View>
  );
}
