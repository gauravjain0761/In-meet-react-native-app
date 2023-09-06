import {
  View,
  Dimensions,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get, isEmpty, uniqueId } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { ButtonTypeTwo, UnChosenButton } from '../../components/common/Button';
import { BodyThree, CaptionFive, CaptionFour } from '../../components/common/Text';
import { RootStackScreenProps } from '../../types';
import { useAppDispatch } from '~/store';
import { selectUserId } from '~/store/userSlice';
import uploadFile from '~/store/fileSlice';
import useCustomHeader from '~/hooks/useCustomHeader';

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

export default function AddPhotoScreen(props: RootStackScreenProps<'AddPhotoScreen'>) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();

  const userId = useSelector(selectUserId) as number;
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  useFocusEffect(() => {
    const routePhotos = get(route, 'params.photos', []);
    if (!isEmpty(routePhotos)) {
      const newPhotos = routePhotos.map(p => ({
        ...p,
        id: uniqueId(),
      }));
      setPhotos(newPhotos);
      navigation.setParams({ photos: null });
    }
  });
  useCustomHeader({ title: '發表照片', navigation });
  const handleOnPressAddImage = () => {
    navigation.navigate('ImageBrowser', {
      backScreen: 'AddPhotoScreen',
    });
  };

  const handlePressPost = async () => {
    setLoading(true);
    try {
      const dataPhotos = photos.map(photo => ({
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        name: photo.name,
        type: photo.type,
      }));
      const uploadPhotoPromise = dataPhotos.map(photo =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'PHOTO',
            userId,
          }),
        ).unwrap(),
      );
      await Promise.all(uploadPhotoPromise);
      queryClient.invalidateQueries('fetchProfilePhotos');
      navigation.goBack();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.black1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, minHeight: height - top - bottom - bottom }}>
        <View style={styles.imageContainer}>
          {photos.map((photo: IPhoto) => (
            <ImageBackground
              key={photo.id}
              style={[styles.image]}
              imageStyle={{ borderRadius: 15 }}
              source={{ uri: photo.uri }}
            />
          ))}
          <UnChosenButton
            title="重新選擇"
            onPress={handleOnPressAddImage}
            containerStyle={{ width: '100%', paddingHorizontal: 20 }}
          />
        </View>
        <View>
          <UnChosenButton
            onPress={() => {
              navigation.goBack();
            }}
            title="取消"
            containerStyle={{ paddingHorizontal: 40 }}
          />
          <ButtonTypeTwo
            loading={loading}
            onPress={handlePressPost}
            containerStyle={{ paddingHorizontal: 40, marginTop: 10 }}
            title="發表"
          />
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}
