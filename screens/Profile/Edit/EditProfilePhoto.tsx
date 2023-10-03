import {
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
  FlatList,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get, isEmpty, uniqueId } from 'lodash';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Row, Col } from 'react-native-responsive-grid-system';
import { useQuery } from 'react-query';
import { RootState, useAppDispatch } from '~/store';
import { addForumPost } from '~/store/forumSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
import uploadFile from '~/store/fileSlice';
import { mapIcon } from '~/constants/IconsMapping';
import useCustomHeader from '~/hooks/useCustomHeader';
import { BodyThree, CaptionFive, CaptionFour, TitleTwo } from '~/components/common/Text';
import { ButtonTypeTwo } from '~/components/common/Button';
import { userApi } from '~/api/UserAPI';
import { fontSize } from '~/helpers/Fonts';
import Loader from '~/components/common/Loader';

const { width } = Dimensions.get('window');
const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  inputStyle: {
    width: '100%',
    backgroundColor: theme.colors?.black2,
    borderWidth: 1,
    borderColor: theme.colors?.black3,
    borderRadius: 20,
    height: 240,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    fontSize: 12,
    fontWeight: '300',
  },
  textAreaContainer: {
    paddingHorizontal: 16,
  },
  hintText: {
    paddingTop: 7,
    color: theme.colors?.black4,
    textAlign: 'right',
  },
  image: {
    // width: '100%',
    // aspectRatio: 1,
    // position: 'relative',
    // aspectRatio: 1,
    // position: 'relative',
    width: 170,
    height: 170,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  uploadTitle: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: fontSize(14),
    // textAlign: 'center',
  },
  addButtonContainer: {
    backgroundColor: theme.colors.black2,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface IPhoto {
  isFromRemote: boolean;
  id: number;
  name: string;
  type: string;
  uri: string;
}

export default function EditProfilePhoto(props) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [bodyText, setBodyText] = useState('');
  const [selectId, setSelectId] = useState(0);
  const [photos, setPhotos] = useState<IPhoto[]>([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  const [photosList, setPhotosList] = useState<IPhoto[]>([]);
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const [loading, setLoading] = React.useState(false);
  const userId = useSelector(selectUserId) as number;
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const [removedPhotosIds, setRemovedPhotosIds] = useState<number[]>([]);
  const [userPhotosIds, setUserPhotosIds] = useState<number[]>([]);
  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      if (selectId == 0) {
        const userPhotoUpdate = userPhotosIds.map((item: any) => {
          return {
            ...item,
            uri: routePhotos?.[0]?.uri,
            name: routePhotos?.[0]?.name,
          };
        });
        console.log('userPhotoUpdate',userPhotoUpdate);
        
        setUserPhotosIds(userPhotoUpdate);
      } else {
        const updatePhoto = photos.map((item) => {
          if (item.id === selectId) {
            return {
              ...routePhotos[0],
            };
          } else {
            return { ...item };
          }
        });
        setPhotos(updatePhoto);
      }

      // const newPhotos = routePhotos.map((p,index) => ({
      //   ...p,
      //   id: uniqueId(),
      // }));
      // setPhotos((prev) => [...prev, ...newPhotos]);
      navigation.setParams({ photos: null });
      setSelectId(0);
    }
  });

  useEffect(() => {
    const getAvatars = async () => {
      setLoading(true)
      const res = await userApi.fetchUserAvatars({ token, id: userId });
      const p = res.records.map((record) => ({
        isFromRemote: true,
        uri: record.fileInfoResponse.url,
        id: record.id,
        name: record.fileInfoResponse.realFileName,
      }));
      setLoading(false)
      setPhotosList(p);
      setUserPhotosIds(p);
    };
    getAvatars();
  }, []);

  const onMainPhotoPress = (photoId: number) => {
    const filterdata = userPhotosIds.map((item: any) => {
      if (item.id === photoId) {
        return {
          id: photoId,
        };
      } else {
        return { ...item };
      }
    });
    setUserPhotosIds(filterdata);
    setRemovedPhotosIds((prev) => [...prev, photoId]);
  };

  const handleDeleteImage = (photoId: number, isFromRemote: boolean) => {
    // if (isFromRemote) {
    //   setRemovedPhotosIds((prev) => [...prev, photoId]);
    // }
    const filterdata = photos.map((item) => {
      if (item.id === photoId) {
        return {
          id: photoId,
        };
      } else {
        return { ...item };
      }
    });
    setPhotos(filterdata);
    // setPhotos((prev) => {
    //   const newPhoto = prev.filter((photo) => photo.id !== photoId);
    //   return newPhoto;
    // });
  };
  // useCustomHeader({ title: '照片編輯', navigation });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '編輯生活照',
      headerLeft: (props) => {
        return (
          <TouchableOpacity onPress={navigation.goBack} style={{}}>
            {mapIcon.backIcon({ size: 28 })}
          </TouchableOpacity>
        );
      },
    });
  });

  const handlePressPost = async () => {
    // navigation.goBack();
    try {
      const dataPhotos = photos
        .filter((i) => !i?.isFromRemote)
        .map((photo) => ({
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
          name: photo.name,
          type: photo.type,
        }));
      if (removedPhotosIds.length !== 0) {
        const removePromise = removedPhotosIds.map((ids) =>
          userApi.deleteUserAvatars({ token, id: ids })
        );

        await Promise.all(removePromise);
        navigation.goBack();
      }
      if (dataPhotos.length === 0) return;
      const uploadPhotoPromise = dataPhotos.map((photo) =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'AVATAR',
            userId,
          })
        ).unwrap()
      );
      const allPhotoPromise = await Promise.all(uploadPhotoPromise);
      const photosUrls = allPhotoPromise
        .map((p) => p.data?.url)
        .filter((e) => e)
        .join(',');

      const content = JSON.stringify(bodyText);
      const data = {
        photo: photosUrls,
        content: content.substring(1, content.length - 1),
        userId,
      };
      // const res = await dispatch(addForumPost(data)).unwrap();
      navigation.goBack();
    } catch (error) {}
  };

  const handleOnPressAddImage = (item: any, isFromRemote: boolean) => {
    if (isFromRemote) {
      setSelectId(0);
      navigation.navigate('ImageBrowserNew', {
        backScreen: 'EditProfilePhoto',
        maxLength: 1,
        selectid: item.id,
      });
    } else {
      setSelectId(item.id);
      navigation.navigate('ImageBrowserNew', {
        backScreen: 'EditProfilePhoto',
        maxLength: 1,
        selectid: item.id,
      });
    }
  };

  const data = photosList.filter((e) => e).map((item) => item.uri);

  const renderItem = ({ item }) => {
    return (
      <Image
        style={{ width: '100%', aspectRatio: 1.1, resizeMode: 'cover' }}
        source={{ uri: item }}
      />
    );
  };

  // const renderPhotos =
  //   photos.length < 5
  //     ? [...photos, ...Array.from({ length: 4 - photos.length }, (v, i) => v)]
  //     : photos;

  //     console.log('renderPhotos',renderPhotos);

  return (
     <Loader
      isLoading={
        loading 
      }>
    <View style={{ backgroundColor: theme.colors.black1, flex: 1 }}>
      <View style={{ position: 'relative' }}>
        <Carousel
          onSnapToItem={setActiveSlide}
          data={data}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
        />
        <Pagination
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
        />
      </View>
      <TitleTwo style={styles.uploadTitle}>上傳生活照</TitleTwo>
      {/* <View style={{ flex: 1,flexWrap:"wrap" }}>
        <Row>
          {renderPhotos.map((photo: IPhoto, index) => (
            <Col colStyles={{ marginBottom: 5,}} key={index} xs={3} sm={3} md={3} lg={3}>
              {!photo ? (
                <TouchableOpacity
                  key={index}
                  onPress={handleOnPressAddImage}
                  style={[styles.image, styles.addButtonContainer]}>
                  {mapIcon.addIcon({ color: theme.colors.white, size: 60 })}
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  key={index}
                  style={[styles.image]}
                  imageStyle={{ borderRadius: 15 }}
                  source={{ uri: photo.uri }}>
                  <TouchableOpacity
                    style={{ right: 10, bottom: 10, position: 'absolute' }}
                    onPress={() => handleDeleteImage(photo.id, photo.isFromRemote)}>
                    {mapIcon.deleteIcon({ color: theme.colors.white })}
                  </TouchableOpacity>
                </ImageBackground>
              )}
            </Col>
          ))}
        </Row>
      </View> */}
      {/* <View style={{ flex: 1,flexWrap:"wrap" }}>
        <Row>
          {renderPhotos.map((photo: IPhoto, index) => (
            <Col colStyles={{ marginBottom: 5,}} key={index} xs={3} sm={3} md={3} lg={3}>
              {!photo ? (
                <TouchableOpacity
                  key={index}
                  onPress={handleOnPressAddImage}
                  style={[styles.image, styles.addButtonContainer]}>
                  {mapIcon.addIcon({ color: theme.colors.white, size: 60 })}
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  key={index}
                  style={[styles.image]}
                  imageStyle={{ borderRadius: 15 }}
                  source={{ uri: photo.uri }}>
                  <TouchableOpacity
                    style={{ right: 10, bottom: 10, position: 'absolute' }}
                    onPress={() => handleDeleteImage(photo.id, photo.isFromRemote)}>
                    {mapIcon.deleteIcon({ color: theme.colors.white })}
                  </TouchableOpacity>
                </ImageBackground>
              )}
            </Col>
          ))}
        </Row>
      </View> */}
      <View style={{ flexDirection: 'row', marginHorizontal: 24, flex: 1 }}>
        {userPhotosIds.map((item) => {
          return (
            <>
              {!item?.uri ? (
                <TouchableOpacity
                  // key={index}
                  onPress={() => {
                    handleOnPressAddImage(item, true);
                  }}
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: 15,
                    backgroundColor: theme.colors.black2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {mapIcon.addIcon({ color: theme.colors.white, size: 70 })}
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  style={[styles.image]}
                  imageStyle={{ borderRadius: 15 }}
                  source={{ uri: item.uri }}>
                  <TouchableOpacity
                    style={{
                      right: 10,
                      top: 10,
                      position: 'absolute',
                      backgroundColor: '#383A44',
                      borderRadius: 18,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      onMainPhotoPress(item?.id);
                    }}>
                    {mapIcon.closeIcon({ color: theme.colors.white, size: 18 })}
                  </TouchableOpacity>
                </ImageBackground>
              )}
            </>
          );
        })}

        <View style={{ marginLeft: 10 }}>
          <FlatList
            data={photos}
            // data={renderPhotos}
            numColumns={2}
            renderItem={({ item }: any) => {
              return (
                <>
                  {!item?.uri ? (
                    <TouchableOpacity
                      // key={index}
                      onPress={() => handleOnPressAddImage(item, false)}
                      style={{
                        width: 82,
                        height: 82,
                        backgroundColor: theme.colors.black2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 12,
                        marginRight: 14,
                        marginBottom: 6,
                      }}>
                      {mapIcon.addIcon({ color: theme.colors.white, size: 34 })}
                    </TouchableOpacity>
                  ) : (
                    <ImageBackground
                      key={item.id}
                      style={{
                        width: 82,
                        height: 82,
                        backgroundColor: theme.colors.black2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 12,
                        marginRight: 14,
                        marginBottom: 6,
                      }}
                      imageStyle={{ borderRadius: 4 }}
                      source={{ uri: item?.uri }}>
                      <TouchableOpacity
                        style={{
                          right: 10,
                          top: 10,
                          position: 'absolute',
                          backgroundColor: '#383A44',
                          borderRadius: 18,
                          width: 20,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => handleDeleteImage(item?.id, item?.isFromRemote)}>
                        {mapIcon.closeIcon({ color: theme.colors.white, size: 18 })}
                      </TouchableOpacity>
                    </ImageBackground>
                  )}
                </>
              );
            }}
          />
        </View>
      </View>

      <ButtonTypeTwo
        onPress={handlePressPost}
        containerStyle={{ paddingHorizontal: 40, bottom: bottom + 20 }}
        title="發表"
      />
    </View>
    </Loader>
  );
}
