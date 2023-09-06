import {
  ImageObject,
  IProps,
  RenderImageProps,
} from '@georstat/react-native-image-gallery/lib/typescript/types';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { get } from 'lodash';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useLayoutEffect,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Menu } from 'react-native-paper';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { userApi } from '~/api/UserAPI';
import { mapIcon } from '~/constants/IconsMapping';
import { BLOCK_REPORT_TYPE } from '~/constants/mappingValue';
import {getUserInfo, selectToken, selectUserId } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';
import { BodyTwo, CaptionFour } from './common/Text';
import ImagePreview from './ImagePreview';
import Toast from 'react-native-root-toast';
import SwipeContainer from './SwipeContainer';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#383A44',
    flex: 1,
    height: deviceHeight,
    justifyContent: 'center',
    width: deviceWidth,
  },
  headerTitle: {
    color: 'white',
  },
  headerStyle: {
    backgroundColor: '#383A44',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  activeThumb: {
    borderWidth: 3,
  },
  thumb: {
    borderRadius: 12,
    marginRight: 10,
  },
  thumbnailListContainer: {
    paddingHorizontal: 10,
  },
  bottomFlatlist: {
    position: 'absolute',
  },
  likeBanner:{
    position: 'absolute',

  },
  overlapContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 120,
    backgroundColor: '#A8ABBD',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    transform: [{ translateX: -35 }],
  },
  text: {
    color: 'white',
    paddingLeft: 10,
  },
});

const defaultProps = {
  hideThumbs: false,
  resizeMode: 'contain',
  thumbColor: '#d9b44a',
  thumbResizeMode: 'cover',
  thumbSize: 48,
};

enum LEVEL {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

function ImageGallery(props: IProps & typeof defaultProps) {
  const {
    close,
    hideThumbs,
    images,
    initialIndex,
    isOpen,
    renderCustomImage,
    renderCustomThumb,
    resizeMode,
    thumbColor,
    thumbResizeMode,
    thumbSize,
    disableSwipe,
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const topRef = useRef<FlatList>(null);
  const bottomRef = useRef<FlatList>(null);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const level = useSelector((state: RootState) => state.user.level);
  
  const { mutate: lockPhoto, isLoading: isLockPhotoLoading } = useMutation(userApi.lockPhoto, {
    onSuccess: data => {},
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
    },
  });
  const { mutate: deletePhoto, isLoading: isDeletePhotoLoading } = useMutation(
    userApi.deletePhoto,
    {
      onSuccess: data => {},
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
      },
    },
  );
  const { mutate: unLockPhoto, isLoading: isUnLockPhotoLoading } = useMutation(
    userApi.unLockPhoto,
    {
      onSuccess: data => {},
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
      },
    },
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
  const openMenu = () => {
    setVisible(true);
  };
  const closeMenu = () => {
    setVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerLeft: props =>
        Platform.OS === 'android' ? null : (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
      headerTitle: props => {
        return <BodyTwo style={styles.headerTitle}>相簿</BodyTwo>;
      },
      headerRight: props => {
        return (
          <TouchableOpacity style={{ paddingRight: 16 }} onPress={openMenu}>
            {mapIcon.more()}
          </TouchableOpacity>
        );
      },
    });
  });

  const handleLockPhoto = () => {
    const photoId = get(images, `[${activeIndex}].id`);
    if (typeof photoId !== 'number') return;
    if (isLockPhotoLoading) return;

    lockPhoto({
      token,
      photoId,
    });
    closeMenu();
    navigation.goBack();
  };
  const handleUnLockPhoto = () => {
    const photoId = get(images, `[${activeIndex}].id`);
    if (typeof photoId !== 'number') return;
    if (isUnLockPhotoLoading) return;

    unLockPhoto({
      token,
      photoId,
    });
    closeMenu();
    navigation.goBack();
  };
  const handleDeletePhoto = () => {
    const photoId = get(images, `[${activeIndex}].id`);
    if (typeof photoId !== 'number') return;
    if (isDeletePhotoLoading) return;
    deletePhoto({
      token,
      photoId,
    });
    closeMenu();
    navigation.goBack();
  };
  const handleReportPhoto = () => {
    const photoId = get(images, `[${activeIndex}].id`);
    navigation.navigate('ReportScreen', {
      id: photoId,
      blockReportType: BLOCK_REPORT_TYPE.FILE,
    });
    closeMenu();
  };
  const keyExtractorThumb = (item: ImageObject, index: number) =>
    item && item.id ? item.id.toString() : index.toString();
  const keyExtractorImage = (item: ImageObject, index: number) =>
    item && item.id ? item.id.toString() : index.toString();

  const scrollToIndex = (i: number) => {
    setActiveIndex(i);

    if (topRef?.current) {
      topRef.current.scrollToIndex({
        animated: true,
        index: i,
      });
    }
    if (bottomRef?.current) {
      if (i * (thumbSize + 10) - thumbSize / 2 > deviceWidth / 2) {
        bottomRef?.current?.scrollToIndex({
          animated: true,
          index: i,
        });
      } else {
        bottomRef?.current?.scrollToIndex({
          animated: true,
          index: 0,
        });
      }
    }
  };
  const handlePressLike = async (item:any) => {
    try {
      if (!item.id) throw item;
      if (isUnLikeLoading || isLikeLoading) return;
      if (item.isLock && !item.isUnLockBefore && level !== LEVEL.VIP) return;
      if (item.isLikeBefore) {
        unLikePhoto({ token, id: item.id });
        item.isLikeBefore=!item.isLikeBefore;
        item.point--;
        return;
      }
      likePhoto({ token, id: item.id });
      item.point++;
      item.isLikeBefore=!item.isLikeBefore;
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  const renderItem = ({ item, index }: RenderImageProps) => {
    return (
        <View>
          <ImagePreview
        index={index}
        isSelected={activeIndex === index}
        item={item}
        resizeMode={resizeMode}
        renderCustomImage={renderCustomImage}
      />
      <TouchableOpacity onPress={() =>handlePressLike(item)} style={styles.overlapContainer}>
      { item.isLikeBefore?mapIcon.likeIcon({color:theme.colors.pink,size:24}) : mapIcon.heartOutlineIcon({color:theme.colors.white})}
        <CaptionFour style={styles.text}>{item.point}</CaptionFour>
      </TouchableOpacity>
      </View>
      
    );
  };
  const renderThumb = ({ item, index }: RenderImageProps) => {
    return (
      <TouchableOpacity onPress={() => scrollToIndex(index)} activeOpacity={0.8}>
        {renderCustomThumb ? (
          renderCustomThumb(item, index, activeIndex === index)
        ) : (
          <Image
            resizeMode={thumbResizeMode}
            style={
              activeIndex === index
                ? [
                    styles.thumb,
                    styles.activeThumb,
                    { borderColor: thumbColor },
                    { width: thumbSize, height: thumbSize },
                  ]
                : [styles.thumb, { width: thumbSize, height: thumbSize }]
            }
            source={{ uri: item.thumbUrl ? item.thumbUrl : item.url }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const onMomentumEnd = (e: any) => {
    const { x } = e.nativeEvent.contentOffset;
    scrollToIndex(Math.round(x / deviceWidth));
  };

  useEffect(() => {
    if (isOpen && initialIndex) {
      setActiveIndex(initialIndex);
    } else if (!isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen, initialIndex]);

  const getImageLayout = useCallback((_, index) => {
    return {
      index,
      length: deviceWidth,
      offset: deviceWidth * index,
    };
  }, []);

  const getThumbLayout = useCallback(
    (_, index) => {
      return {
        index,
        length: thumbSize,
        offset: thumbSize * index,
      };
    },
    [thumbSize],
  );

  const itemStyle = {
    height: 32,
    borderBottomEndRadius: 20,
    paddingHorizontal: 5,
    borderBottomStartRadius: 20,
    zIndex: 100,
  };

  const renderMoreButton = () => {
    return (
      <Menu
        contentStyle={{
          backgroundColor: theme.colors.black2,
          borderRadius: 20,
          paddingVertical: 0,
          zIndex: 100,
        }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={{ x: width - 10, y: headerHeight }}>
        {userId === images[activeIndex]?.userId ? (
          <>
            {images[activeIndex]?.isLock && (
              <Menu.Item
                onPress={handleUnLockPhoto}
                style={itemStyle}
                title={
                  <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                    解鎖此圖片
                  </CaptionFour>
                }
              />
            )}
            {!images[activeIndex]?.isLock && (
              <Menu.Item
                onPress={handleLockPhoto}
                style={itemStyle}
                title={
                  <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                    鎖定此圖片
                  </CaptionFour>
                }
              />
            )}
            <Menu.Item
              style={itemStyle}
              onPress={handleDeletePhoto}
              title={
                <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                  刪除此圖片
                </CaptionFour>
              }
            />
          </>
        ) : (
          <Menu.Item
            style={itemStyle}
            onPress={handleReportPhoto}
            title={
              <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
                檢舉此圖片
              </CaptionFour>
            }
          />
        )}
      </Menu>
    );
  };

  return (
    <>
      {renderMoreButton()}
      <View style={styles.container}>
        <SwipeContainer disableSwipe={disableSwipe} setIsDragging={setIsDragging} close={close}>
          <FlatList
            initialScrollIndex={initialIndex}
            getItemLayout={getImageLayout}
            data={images}
            horizontal
            keyExtractor={keyExtractorImage}
            onMomentumScrollEnd={onMomentumEnd}
            pagingEnabled
            ref={topRef}
            renderItem={renderItem}
            scrollEnabled={!isDragging}
            showsHorizontalScrollIndicator={false}
          />
        </SwipeContainer>
        {hideThumbs ? null : (
          <FlatList
            initialScrollIndex={initialIndex}
            getItemLayout={getThumbLayout}
            contentContainerStyle={styles.thumbnailListContainer}
            data={images}
            horizontal
            keyExtractor={keyExtractorThumb}
            pagingEnabled
            ref={bottomRef}
            renderItem={renderThumb}
            showsHorizontalScrollIndicator={false}
            style={[styles.bottomFlatlist, { bottom: thumbSize }]}
          />
        )}
      </View>
    </>
  );
}

ImageGallery.defaultProps = defaultProps;

export default ImageGallery;
