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
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const { height, width } = Dimensions.get('window');

interface FormData {
  avatar: ImageResult | null;
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 15,
    textAlign: 'center',
    marginTop:15
  },
  bodyText: {
    color: theme.colors?.black4,
    paddingBottom: 30,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
  },

  footerContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
    flexGrow: 1,
  },
  avatarWrapper: {
    flexGrow: 1,
    marginTop: 80,
    marginBottom: 20,
    borderColor: theme.colors?.black5,
  },
  avatarContainer: {
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 40,
    aspectRatio: 1,
    backgroundColor: theme.colors?.black2,
    padding: 45,
    shadowColor: theme.colors?.black,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
    borderColor: theme.colors?.black4,
    borderWidth: 2,
  },
  imageContainer: {
    // aspectRatio: 1,
    // maxHeight: '100%',
    // shadowColor: theme.colors?.black,
    // shadowOpacity: 0.25,
    // shadowRadius: 20,
    // elevation: 20,
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
    marginTop:23
  },
  actionSheetContainer: {
    opacity: 1,
    backgroundColor: theme.colors?.white,
  },
  forDefaultAvatar: {
    position: 'absolute',
    right: '-10%',
    top: '-5%',
    width: '120%',
    height: '120%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    // marginEnd:0,
    // paddingEnd:0,
    // bottom: 0,
  },
  keypointText: {
    color: theme.colors?.pink,
    fontFamily:'roboto',
    fontSize:fontSize(12)
  },
}));

export default function RegisterImageScreen(props: RegisterImageScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const { showActionSheetWithOptions } = useActionSheet();
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

  const [openLocationAsync] = useRequestLocation();
  const register = useSelector((state: RootState) => state.register);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handlePressOnEdit = (onChange: (event: any) => void) => {
    const options = ['圖庫', '相機', '取消'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      buttonIndex => {
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
      },
    );
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const { latitude, longitude } = await openLocationAsync({});
      const { data } = await dispatch(
        patchRegister({ ...register, phone: `${register.phone}` }),
      ).unwrap();

      if (data?.id) {
        if (register.avatar) {
          await dispatch(
            uploadFile({
              fileData: {
                type: Platform.OS === 'ios' ? 'image' : 'image/jpg',
                uri:
                  Platform.OS === 'ios' ? register.avatar.replace('file://', '') : register.avatar,
                name: 'unnamed.png',
              },
              fileType: 'AVATAR',
              userId: data?.id,
            }),
          ).unwrap();
        }

        dispatch(cleanUpRegister());
        await storeUserIsFromRegistered('isFromRegistered');
        // clear the data and the flag on landing screen
        await clearUserStorage();
        const loginResponse = await dispatch(
          loginUser({ username: register.phone, password: register.password, latitude, longitude }),
        ).unwrap();
        if (loginResponse.code !== 20000) {
          throw loginResponse;
        }
        // await dispatch(getUserInfo({ token: loginResponse.data })).unwrap();
        dispatch(patchUserToken(loginResponse.data));
        dispatch(patchUserFromRegister(true));
        await storeUserToken(loginResponse.data);
      }
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
    setLoading(false);
  };

  const onSubmit = async (data: any) => {
    const { avatar } = data;
    if (!avatar) {
      Toast.show('請至少上傳一張照片');
    } else {
      await dispatch(updateAvatar(avatar.uri));
      handleRegister();
    }
  };

  const backToPrevious = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
          source={mapIcon.illus3zIcon}
          style={{
            width: 332,
            height: 203,
            position: 'absolute',
            right:0
          }}
        />
      <ScrollView style={{ flexGrow: 1 }}>
        <ProgressBar step={2} />
        <View style={styles.bodyContainer}>
          <TouchableOpacity
            onPress={backToPrevious}
            style={{ position: 'absolute', left: 20, top: 20 }}>
            {mapIcon.backIcon({size:22})}
          </TouchableOpacity>
          <TitleOne style={styles.titleText}>上傳大頭照</TitleOne>
          <Controller
            name="avatar"
            control={control}
            rules={
              {
                // required: 'This is required',
              }
            }
            render={({ field: { onChange, value } }) => (
              <View style={styles.avatarWrapper}>
                {value?.uri ? (
                  <>
                    <View style={styles.imageContainer}>
                      <Image style={styles.image} source={{ uri: value?.uri }} />
                    </View>
                    <ButtonTypeTwo
                      onPress={() => handlePressOnEdit(onChange)}
                      buttonStyle={styles.editButtonStyle}
                      title={<SubTitleOne style={styles.editButtonText}>換一張</SubTitleOne>}
                    />
                  </>
                ) : (
                  <View>
                    <View style={styles.avatarContainer}>
                      <ButtonTypeTwo
                        onPress={() => handlePressOnEdit(onChange)}
                        buttonStyle={{ height: 48, width: 48, borderRadius: 24, marginTop: 30 }}
                        icon={<Entypo name="plus" size={24} color="#fff" />}
                      />
                      <ButtonTypeTwo
                        onPress={() => handlePressOnEdit(onChange)}
                        buttonStyle={{ width: 208, marginTop: 40, marginBottom: 0 }}
                        title={<SubTitleTwo style={{ color: '#fff' }}>{"上傳照片"}</SubTitleTwo>}
                      />
                    </View>
                    <CaptionFour style={styles.bodyText}>
                      {'請上傳 '}
                      <Text style={styles.keypointText}>{"五官清晰的真人照片"}</Text>
                      {"，才能增加配對成功率唷"}
                    </CaptionFour>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <ButtonTypeTwo
          loading={loading}
          title={<SubTitleOne style={styles.chosenButtonText}>完成</SubTitleOne>}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
  );
}
