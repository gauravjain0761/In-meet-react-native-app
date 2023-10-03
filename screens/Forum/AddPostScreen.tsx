import {
  View,
  TextInput,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  FlatList,
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
import { BodyOne, BodyThree, CaptionFive, CaptionFour } from '../../components/common/Text';
import { RootStackScreenProps } from '../../types';
import { useAppDispatch } from '~/store';
import { addForumPost } from '~/store/forumSlice';
import { selectUserId } from '~/store/userSlice';
import uploadFile from '~/store/fileSlice';
import { mapIcon } from '~/constants/IconsMapping';
import Loader from '~/components/common/Loader';
import { fontSize } from '~/helpers/Fonts';

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
    height: 290,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    fontSize: fontSize(14),
    color: theme.colors.white,
    fontWeight: '300',
    textAlignVertical: 'top',
    maxHeight: 320,
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
    // width: '100%',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  uploadTitle: {
    color: theme.colors?.white,
    paddingBottom: 10,
  },
  uploadSubTitle: {
    color: theme.colors?.black3,
    paddingBottom: 10,
    marginLeft: 5,
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
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector(selectUserId) as number;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      const newPhotos = routePhotos.map((p) => ({
        ...p,
        id: uniqueId(),
      }));
      setPhotos((prev) => [...prev, ...newPhotos]);
      navigation.setParams({ photos: null });
    }
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
      headerTitle: '發表貼文',
    });
  }, []);
  const handleDeleteImage = (photoId: number) => {
    setPhotos((prev) => {
      const newPhoto = prev.filter((photo) => photo.id !== photoId);

      return newPhoto;
    });
  };

  console.log('photos',photos);
  

  const handlePressPost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const [_, ...imgPhotos] = photos;
    console.log(imgPhotos);
    
    try {
      const dataPhotos = photos.map((photo) => ({
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        name: photo.name,
        type: photo.type,
      }));
      console.log('dataPhotos',dataPhotos);
      
      const uploadPhotoPromise = dataPhotos.map((photo) =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'BLOG',
            userId,
          })
        ).unwrap()
      );
      const allPhotoPromise = await Promise.all(uploadPhotoPromise);
      const photosUrls = allPhotoPromise
        .map((p) => p.data?.url)
        .filter((e) => e)
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
    } catch (error) {
      console.log('error',error);
      
    }
    setIsLoading(false);
  };

  const handleOnPressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'AddPostScreen',
    });
  };

  const renderPhotos =
    photos.length < 3
      ? [...photos, ...Array.from({ length: 3 - photos.length }, (v, i) => v)]
      : photos;
  return (
    <Loader isLoading={isLoading}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: 80 }}>
        <View style={styles.textAreaContainer}>
          <TextInput
            onChangeText={setBodyText}
            value={bodyText}
            placeholder="輸入內容..."
            multiline
            placeholderTextColor={theme.colors.black4}
            maxLength={300}
            style={styles.inputStyle}
          />
          <CaptionFive style={styles.hintText}>{bodyText.length}/300</CaptionFive>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 10,
          }}>
          <BodyOne style={styles.uploadTitle}>上傳照片</BodyOne>
          <BodyOne style={styles.uploadSubTitle}>上限9張</BodyOne>
        </View>

        <View style={styles.imageContainer}>
          {/* <FlatList
            data={photos}
            horizontal
            renderItem={({ item, index }: any) => {
              console.log('index', item);
              return (
                <>
                  {item?.uri !== '' ? (
                    <TouchableOpacity
                      key="addImage"
                      onPress={handleOnPressAddImage}
                      style={[styles.image, { marginRight: 10 }, styles.addButtonContainer]}>
                      {mapIcon.addIcon({ color: theme.colors.white, size: 60 })}
                    </TouchableOpacity>
                  ) : (
                    <ImageBackground
                      key={item?.id}
                      style={[styles.image, (index + 1) % 3 !== 0 ? { marginRight: 10 } : {}]}
                      imageStyle={{ borderRadius: 15 }}
                      source={{ uri: item?.uri }}>
                      <TouchableOpacity
                        style={{
                          right: 10,
                          top: 10,
                          position: 'absolute',
                          width: 25,
                          height: 25,
                          borderRadius: 25 / 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: theme.colors.black1,
                        }}
                        onPress={() => handleDeleteImage(item?.id)}>
                        {mapIcon.closeIcon({ color: theme.colors.white, size: 18 })}
                      </TouchableOpacity>
                    </ImageBackground>
                  )}
                </>
              );
            }}
          /> */}
          <ScrollView horizontal showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >
            {renderPhotos?.map((photo: IPhoto, index) =>
                !photo ? (
                  <TouchableOpacity
                    key="addImage"
                    onPress={handleOnPressAddImage}
                    style={[
                      styles.image,
                      (index + 1) % 3 !== 0 ? { marginRight: 10 } : {marginRight: 10},
                      styles.addButtonContainer,
                    ]}>
                    {mapIcon.addIcon({ color: theme.colors.white, size: 60 })}
                  </TouchableOpacity>
                ) : (
                  <ImageBackground
                    key={photo.id}
                    style={[styles.image, (index + 1) % 3 !== 0 ? { marginRight: 10 } : {marginRight: 10}]}
                    imageStyle={{ borderRadius: 15 }}
                    source={{ uri: photo?.uri }}>
                    <TouchableOpacity
                      style={{
                        right: 10,
                        top: 10,
                        position: 'absolute',
                        width: 25,
                        height: 25,
                        borderRadius: 25 / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.colors.black1,
                      }}
                      onPress={() => handleDeleteImage(photo?.id)}>
                      {mapIcon.closeIcon({ color: theme.colors.white, size: 18 })}
                    </TouchableOpacity>
                  </ImageBackground>
                )
              )}
          </ScrollView>
        </View>
        <ButtonTypeTwo
          disabled={bodyText == '' ? true : false}
          disabledStyle={{ backgroundColor: 'rgba(255, 78, 132, 0.5)' }}
          disabledTitleStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          onPress={handlePressPost}
          containerStyle={{ paddingHorizontal: 40, paddingVertical: 20 }}
          title="發表"
        />
      </KeyboardAwareScrollView>
    </Loader>
  );
}
