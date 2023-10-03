import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import {
  BodyOne,
  BodyThree,
  BodyTwo,
  CaptionFive,
  CaptionFour,
  SubTitleTwo,
  TitleOne,
} from '../../../components/common/Text';
import { ButtonTypeTwo, UnChosenButton } from '../../../components/common/Button';
import CommonModalComponent from '../../../components/common/CommonModalComponent';
import ProfileRowItem from '~/components/Profile/ProfileRowItem';
import InputField from '~/components/common/InputField';
import { RootState, useAppDispatch } from '~/store';
import { mapIcon } from '~/constants/IconsMapping';
import { getUserInfo, loginUser, patchUserToken } from '~/store/userSlice';
import useRequestLocation from '~/hooks/useRequestLocation';
import { storeUserToken } from '~/storage/userToken';
import Loader from '~/components/common/Loader';
import { useHeaderHeight } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';

const useStyles = makeStyles((theme) => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 100,
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 30,
    textAlign: 'center',
  },
  forgetButtonText: {
    color: theme.colors?.black5,
    textAlign: 'center',
    paddingTop: 15,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
}));

enum visiblePasswordActionKind {
  VISIBLE_PASSWORD = 'visible_password',
  INVISIBLE_PASSWORD = 'invisible_password',
  VISIBLE_VERIFY_PASSWORD = 'visible_verify_password',
  INVISIBLE_VERIFY_PASSWORD = 'invisible_verify_password',
  TOGGLE_VISIBLE_PASSWORD = 'toggle_password',
  OLD_TOGGLE_VISIBLE_PASSWORD = 'old_toggle_password',
  TOGGLE_VISIBLE_VERIFY_PASSWORD = 'toggle_visible_password',
}

interface visiblePasswordAction {
  type: visiblePasswordActionKind;
}

interface visiblePasswordState {
  oldVisiblePassword: boolean;
  visiblePassword: boolean;
  visibleVerifyPassword: boolean;
}

const initialState = {
  oldVisiblePassword: false,
  visiblePassword: false,
  visibleVerifyPassword: false,
};

const reducer = (state: visiblePasswordState, action: visiblePasswordAction) => {
  switch (action.type) {
    case visiblePasswordActionKind.OLD_TOGGLE_VISIBLE_PASSWORD:
      return {
        ...state,
        oldVisiblePassword: !state.oldVisiblePassword,
      };
    case visiblePasswordActionKind.TOGGLE_VISIBLE_PASSWORD:
      return {
        ...state,
        visiblePassword: !state.visiblePassword,
      };
    case visiblePasswordActionKind.TOGGLE_VISIBLE_VERIFY_PASSWORD:
      return {
        ...state,
        visibleVerifyPassword: !state.visibleVerifyPassword,
      };
    default:
      return state;
  }
};

export default function ModifyPasswordFirstSetting(
  props: ProfileStackScreenProps<'ModifyPasswordFirstSetting'>
) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useSelector((state: RootState) => state.user);
  const passwordInputRef = useRef<TextInput>(null);
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const storeDispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();

  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  const onSubmit = async (data: any) => {
    const { password } = data;
    // if (password !== user) {
    //   setError('verifyPassword', {
    //     message: 'This is not the same value',
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      const username = user.email as string;
      const loginResponse = await storeDispatch(
        loginUser({
          username,
          password,
        })
      ).unwrap();

      if (loginResponse.code !== 20000) {
        throw loginResponse;
      }
      await storeDispatch(getUserInfo({ token: loginResponse.data })).unwrap();
      storeDispatch(patchUserToken(loginResponse.data));
      await storeUserToken(loginResponse.data);
      navigation.push('ModifyPasswordSetting', {
        oldPassword: password,
      });
    } catch (error) {
      setError(
        'password',
        {
          message: '密碼錯誤',
        },
        { shouldFocus: false }
      );
    } finally {
      setLoading(false);
    }
    // storeDispatch(updatePassword(password))
  };
  const handleConfirm = () => {
    setCollectionModal(false);
  };
  const handleCancel = () => {
    setCollectionModal(false);
  };
  const handleOpen = () => {
    setCollectionModal(true);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '修改密碼',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });

  const handlePressForgetPassword = () => {
    navigation.navigate('ForgetPasswordScreen');
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.black1,
        paddingTop: 20,
        paddingHorizontal: 40,
        marginTop: headerHeight - 10,
      }}>
      <Loader isLoading={loading}>
        <FormProvider {...methods}>
          <KeyboardAwareScrollView style={styles.outerContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <BodyTwo style={{ color: theme.colors.white }}>{'舊密碼'}</BodyTwo>
              <TouchableOpacity>
                <BodyTwo style={{ color: theme.colors.white }}>{'忘記密碼？'}</BodyTwo>
              </TouchableOpacity>
            </View>
            <InputField
              ref={passwordInputRef}
              name="password"
              secureTextEntry={!state.oldVisiblePassword}
              placeholder="輸入原有密碼"
              // label='舊密碼'
              textContentType="password"
              onSubmit={handleSubmit(onSubmit)}
              rules={{
                required: '這是必填欄位',
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: '輸入的格式不正確',
                // },
              }}
              styles={{}}
              onRightPress={() =>
                dispatch({ type: visiblePasswordActionKind.OLD_TOGGLE_VISIBLE_PASSWORD })
              }
              rightStyle={{ top: '52%' }}
              rightIconShow={true}
              right={
                state.oldVisiblePassword ? (
                  <Feather name="eye" size={22} color="#A8ABBD" />
                ) : (
                  mapIcon.invisiblePassword()
                )
              }
            />
            <InputField
              // ref={passwordInputRef}
              containerStyle={{ marginTop: 10 }}
              name="Newpassword"
              secureTextEntry={!state.visiblePassword}
              placeholder="輸入原有密碼"
              label="新密碼"
              textContentType="password"
              onSubmit={handleSubmit(onSubmit)}
              rules={{
                required: '這是必填欄位',
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: '輸入的格式不正確',
                // },
              }}
              styles={{}}
              onRightPress={() =>
                dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_PASSWORD })
              }
              rightStyle={{ top: '65%' }}
              rightIconShow={true}
              right={
                state.visiblePassword ? (
                  <Feather name="eye" size={22} color="#A8ABBD" />
                ) : (
                  mapIcon.invisiblePassword()
                )
              }
            />
            <InputField
              // ref={passwordInputRef}
              containerStyle={{ marginTop: 10 }}
              name="confirmpassword"
              secureTextEntry={!state.visibleVerifyPassword}
              placeholder="請確認密碼"
              label="確認密碼"
              textContentType="password"
              onSubmit={handleSubmit(onSubmit)}
              rules={{
                required: '這是必填欄位',
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: '輸入的格式不正確',
                // },
              }}
              styles={{}}
              rightIconShow={true}
              onRightPress={() =>
                dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_VERIFY_PASSWORD })
              }
              rightStyle={{ top: '65%' }}
              right={
                state.visibleVerifyPassword ? (
                  <Feather name="eye" size={22} color="#A8ABBD" />
                ) : (
                  mapIcon.invisiblePassword()
                )
              }
            />

            <ButtonTypeTwo
              title="確定修改"
              containerStyle={{ marginTop: 70 }}
              onPress={handleSubmit(onSubmit)}
              // onPress={()=>{
              //   navigation.push('ModifyPasswordSetting', {
              //     oldPassword: "password",
              //   });
              // }}
            />
            {/* <TouchableOpacity onPress={handlePressForgetPassword}>
            <BodyThree style={styles.forgetButtonText}>忘記密碼</BodyThree>
          </TouchableOpacity> */}
          </KeyboardAwareScrollView>
        </FormProvider>
        <CommonModalComponent
          modalText="確定要刪除帳號嗎"
          isVisible={collectionModal}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      </Loader>
    </View>
  );
}
