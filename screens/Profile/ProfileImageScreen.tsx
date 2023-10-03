import {
  View,
  Text,
  Dimensions,
  Image,
  Alert,
  Platform,
  Linking,
  Button,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { ImageResult } from 'expo-image-manipulator';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-root-toast';
import { useSelector } from 'react-redux';

import ProgressBar from '../../components/common/ProgressBar';
import {
  BodyThree,
  BodyTwo,
  CaptionFour,
  SubTitleOne,
  SubTitleTwo,
  TitleOne,
} from '../../components/common/Text';
import { ButtonTypeTwo, LikeButton, UnChosenButton } from '../../components/common/Button';
import { mapIcon } from '../../constants/IconsMapping';
import { RegisterImageScreenProps } from '../../types';
import { RootState, useAppDispatch } from '~/store';
import { cleanUpRegister, patchRegister, updateAvatar } from '~/store/registerSlice';
import uploadFile from '~/store/fileSlice';
import { clearUserStorage, storeUserIsFromRegistered, storeUserToken } from '~/storage/userToken';
import { loginUser, patchUserFromRegister, patchUserToken } from '~/store/userSlice';
import useRequestLocation from '~/hooks/useRequestLocation';
import Header from '~/components/common/Header';
import { fontSize } from '~/helpers/Fonts';
import dammyImage from '../../assets/images/firstLogin/bg.png';
const { height, width } = Dimensions.get('window');
import defaultAvatar from '~/assets/images/icons/defaultAvatar.png';

interface FormData {
  avatar: ImageResult | null;
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },

  footerContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: width * 0.4,
    flexGrow: 1,
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 240,
    height: 240,
    // resizeMode: 'cover',
    borderRadius: 15,
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  editButtonText: {
    color: theme.colors?.white,
    fontWeight: 'normal',
  },
  editButtonStyle: {
    justifyContent: 'center',
    marginHorizontal: 60,
    padding: 0,
    height: 40,
    marginTop: 23,
  },
  avatarDisplayName: {
    color: theme.colors?.white,
    fontSize: fontSize(18),
  },
}));

export default function ProfileImageScreen(props: RegisterImageScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const { theme } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const [openLocationAsync] = useRequestLocation();
  const register = useSelector((state: RootState) => state.register);
  const { bottom, top } = useSafeAreaInsets();
  const avatar = useSelector((state: RootState) => state.user.avatar);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [imageValue, setimageValue] = useState(null);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      avatar: null,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
    });
  });
  const handlePressOnEdit = (onChange: (event: any) => void) => {
    const options = ['圖庫', '相機', '取消'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          const openImagePickerAsync = async () => {
            try {
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (permissionResult.granted === false) {
                Alert.alert('沒有相片權限', '請去「設定」> 開啟「相片」權限', [
                  {
                    text: '取消',
                    style: 'cancel',
                  },
                  {
                    text: '允許',
                    onPress: () => {
                      if (Platform.OS === 'android') {
                        Linking.openSettings();
                      }
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      }
                    },
                  },
                ]);
                return;
              }
              const pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
              });
              if (pickerResult.cancelled === true) return;

              onChange(pickerResult);
            } catch (error) {
              alert(error);
            }
          };
          openImagePickerAsync();
        }
        if (buttonIndex === 1) {
          const openCameraAsync = async () => {
            try {
              const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
              if (permissionResult.granted === false) {
                Alert.alert('沒有「相機」權限', '請去「設定」> 開啟「相機」權限', [
                  {
                    text: '取消',
                    style: 'cancel',
                  },
                  {
                    text: '允許',
                    onPress: () => {
                      if (Platform.OS === 'android') {
                        Linking.openSettings();
                      }
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      }
                    },
                  },
                ]);
                return;
              }
              const pickerResult = await ImagePicker.launchCameraAsync();
              if (pickerResult.cancelled === true) return;

              onChange(pickerResult);
            } catch (error) {
              alert(error);
            }
          };
          openCameraAsync();
        }
      }
    );
  };

  const backToPrevious = () => {
    navigation.goBack();
  };

  const HeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
          marginTop: top - 5,
        }}>
        <TouchableOpacity onPress={backToPrevious} style={{}}>
          {mapIcon.backIcon({ size: 24 })}
        </TouchableOpacity>
        <SubTitleTwo style={styles.avatarDisplayName}>{'編輯大頭照'}</SubTitleTwo>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfilePhoto');
          }}
          style={{}}>
          {mapIcon.photoIcon1({ size: 24, color: theme.colors.white })}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={mapIcon.illus3zIcon}
        style={{
          width: 332,
          height: 203,
          position: 'absolute',
          right: 0,
        }}
      />
      <HeaderView />
      <ScrollView style={{ flexGrow: 1 }}>
        <Controller
          name="avatar"
          control={control}
          rules={
            {
              // required: 'This is required',
            }
          }
          render={({ field: { onChange, value } }) => {
            setimageValue(value?.uri);
            return (
              <View style={styles.bodyContainer}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={avatar ? { uri: avatar } : defaultAvatar} />
                </View>
                <ButtonTypeTwo
                        onPress={() => handlePressOnEdit(onChange)}
                  containerStyle={styles.editButtonStyle}
                  title={<SubTitleOne style={styles.editButtonText}>換一張</SubTitleOne>}
                />
              </View>
            );
          }}
        />
      </ScrollView>
      <View style={styles.footerContainer}>
        <ButtonTypeTwo
          // activeOpacity={0.9}
          // loading={loading}
          disabled={imageValue !== '' ? true : false}
          disabledStyle={{ backgroundColor: 'rgba(255, 78, 132, 0.6)' }}
          disabledTitleStyle={{ color: 'rgba(255, 255, 255, 0.2)' }}
          title={<SubTitleOne style={styles.chosenButtonText}>儲存</SubTitleOne>}
          containerStyle={{ borderRadius: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}
