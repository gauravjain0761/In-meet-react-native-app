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
import { useAppDispatch } from '~/store';
import { addForumPost } from '~/store/forumSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
import uploadFile from '~/store/fileSlice';
import { mapIcon } from '~/constants/IconsMapping';
import useCustomHeader from '~/hooks/useCustomHeader';
import { BodyThree, CaptionFive, CaptionFour, TitleTwo } from '~/components/common/Text';
import { ButtonTypeTwo } from '~/components/common/Button';
import { userApi } from '~/api/UserAPI';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
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
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
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
    paddingBottom: 10,
    textAlign: 'center',
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
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = React.useState(0);

  const userId = useSelector(selectUserId) as number;
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const [removedPhotosIds, setRemovedPhotosIds] = useState<number[]>([]);
  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      const newPhotos = routePhotos.map(p => ({
        ...p,
        id: uniqueId(),
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
      navigation.setParams({ photos: null });
    }
  });

  useEffect(() => {
    const getAvatars = async () => {
      const res = await userApi.fetchUserAvatars({ token, id: userId });
      const p = res.records.map(record => ({
        isFromRemote: true,
        uri: record.fileInfoResponse.url,
        id: record.id,
        name: record.fileInfoResponse.realFileName,
      }));

      setPhotos(p);
    };
    getAvatars();
  }, []);

  const handleDeleteImage = (photoId: number, isFromRemote: boolean) => {
    if (isFromRemote) {
      setRemovedPhotosIds(prev => [...prev, photoId]);
    }
    setPhotos(prev => {
      const newPhoto = prev.filter(photo => photo.id !== photoId);

      return newPhoto;
    });
  };
  useCustomHeader({ title: '照片編輯', navigation });

  const handlePressPost = async () => {
    // navigation.goBack();
    try {
      const dataPhotos = photos
        .filter(i => !i.isFromRemote)
        .map(photo => ({
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
          name: photo.name,
          type: photo.type,
        }));
      if (removedPhotosIds.length !== 0) {
        const removePromise = removedPhotosIds.map(ids =>
          userApi.deleteUserAvatars({ token, id: ids }),
        );

        await Promise.all(removePromise);
        navigation.goBack();
      }
      if (dataPhotos.length === 0) return;
      const uploadPhotoPromise = dataPhotos.map(photo =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'AVATAR',
            userId,
          }),
        ).unwrap(),
      );
      const allPhotoPromise = await Promise.all(uploadPhotoPromise);
      const photosUrls = allPhotoPromise
        .map(p => p.data?.url)
        .filter(e => e)
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

  const handleOnPressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'EditProfilePhoto',
    });
  };

  const data = photos.filter(e => e).map(item => item.uri);

  const renderItem = ({ item }) => {
    return (
      <Image
        style={{ width: '100%', aspectRatio: 1.5, resizeMode: 'cover' }}
        source={{ uri: item }}
      />
    );
  };

  const renderPhotos =
    photos.length < 6
      ? [...photos, ...Array.from({ length: 6 - photos.length }, (v, i) => v)]
      : photos;
  return (
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
      <TitleTwo style={styles.uploadTitle}>上傳照片</TitleTwo>
      <View style={{ flex: 1 }}>
        <Row>
          {renderPhotos.map((photo: IPhoto, index) => (
            <Col colStyles={{ marginBottom: 5 }} key={index} xs={4} sm={4} md={4} lg={4}>
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
      </View>

      <ButtonTypeTwo
        onPress={handlePressPost}
        containerStyle={{ paddingHorizontal: 40 }}
        title="發表"
      />
    </View>
  );
}
