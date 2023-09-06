import {
  View,
  TextInput,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get, isEmpty, uniqueId } from 'lodash';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { ButtonTypeTwo } from '../../components/common/Button';
import { BodyThree, CaptionFive, CaptionFour } from '../../components/common/Text';
import { RootStackScreenProps } from '../../types';
import { useAppDispatch } from '~/store';
import { addForumPost } from '~/store/forumSlice';
import { selectUserId } from '~/store/userSlice';
import uploadFile from '~/store/fileSlice';
import { mapIcon } from '~/constants/IconsMapping';
import Loader from '~/components/common/Loader';

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
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: '300',
    textAlignVertical: 'top',
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
    width: (width - 20 - 32) / 3,
    aspectRatio: 1,
    height: 0,
    position: 'relative',
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 10,
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
  },
  addButtonContainer: {
    backgroundColor: theme.colors.black2,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface IPhoto {
  id: number;
  name: string;
  type: string;
  uri: string;
}

export default function AddPostScreen(props: RootStackScreenProps<'AddPostScreen'>) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [bodyText, setBodyText] = useState('');
  const [photos, setPhotos] = useState<IPhoto[]>([{}]);
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector(selectUserId) as number;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackVisible: true,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return <BodyThree style={styles.headerTitle}>發表貼文</BodyThree>;
      },
    });
  }, []);
  const handleDeleteImage = (photoId: number) => {
    setPhotos(prev => {
      const newPhoto = prev.filter(photo => photo.id !== photoId);

      return newPhoto;
    });
  };

  const handlePressPost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const [_, ...imgPhotos] = photos;
    try {
      const dataPhotos = imgPhotos.map(photo => ({
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        name: photo.name,
        type: photo.type,
      }));
      const uploadPhotoPromise = dataPhotos.map(photo =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'BLOG',
            userId,
          }),
        ).unwrap(),
      );
      const allPhotoPromise = await Promise.all(uploadPhotoPromise);
      const photosUrls = allPhotoPromise
        .map(p => p.data?.url)
        .filter(e => e)
        .join(',');

      const content = JSON.stringify(bodyText || '');
      const data = {
        photo: photosUrls,
        content: content.substring(1, content.length - 1),
        userId,
      };
      const res = await dispatch(addForumPost(data)).unwrap();
      queryClient.invalidateQueries('searchForums');
      navigation.goBack();
    } catch (error) {}
    setIsLoading(false);
  };

  const handleOnPressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'AddPostScreen',
    });
  };

  return (
    <Loader isLoading={isLoading}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        <View style={styles.textAreaContainer}>
          <TextInput
            onChangeText={setBodyText}
            value={bodyText}
            placeholder="輸入內容"
            multiline
            placeholderTextColor={theme.colors.black4}
            maxLength={300}
            style={styles.inputStyle}
          />
          <CaptionFive style={styles.hintText}>{bodyText.length}/300</CaptionFive>
        </View>
        <CaptionFour style={styles.uploadTitle}>上傳照片</CaptionFour>

        <View style={styles.imageContainer}>
          {photos.map((photo: IPhoto, index) =>
            index === 0 ? (
              <TouchableOpacity
                key="addImage"
                onPress={handleOnPressAddImage}
                style={[
                  styles.image,
                  (index + 1) % 3 !== 0 ? { marginRight: 10 } : {},
                  styles.addButtonContainer,
                ]}>
                {mapIcon.addIcon({ color: theme.colors.white, size: 60 })}
              </TouchableOpacity>
            ) : (
              <ImageBackground
                key={photo.id}
                style={[styles.image, (index + 1) % 3 !== 0 ? { marginRight: 10 } : {}]}
                imageStyle={{ borderRadius: 15 }}
                source={{ uri: photo.uri }}>
                <TouchableOpacity
                  style={{ right: 10, bottom: 10, position: 'absolute' }}
                  onPress={() => handleDeleteImage(photo.id)}>
                  {mapIcon.deleteIcon({ color: theme.colors.white })}
                </TouchableOpacity>
              </ImageBackground>
            ),
          )}
        </View>
        <ButtonTypeTwo
          onPress={handlePressPost}
          containerStyle={{ paddingHorizontal: 40  ,paddingVertical:20}}
          title="發表"
        />
      </KeyboardAwareScrollView>
    </Loader>
  );
}
