import {
  View,
  Text,
  TextInput,
  Button,
  ColorValue,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  TextInputProps,
  ScrollView,
  Image,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, FormProvider } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import isEmpty from 'lodash/isEmpty';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';

import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import {
  ButtonTypeFourChosen,
  ButtonTypeFourUnChosen,
  ButtonTypeTwo,
  ChosenButton,
  UnChosenButton,
} from '../../components/common/Button';
import { CaptionFour, TitleOne } from '../../components/common/Text';
import { RegisterPasswordScreenProps, RegisterVerifyCodeProps } from '../../types';
import InputField from '../../components/common/InputField';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '~/store';
import { updatePassword } from '~/store/registerSlice';
import { userApi } from '~/api/UserAPI';
import Header from '~/components/common/Header';
import { fontSize } from '~/helpers/Fonts';
import { patchUserFastLogin} from '~/store/userSlice';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  container: {
    flex: 1,
    // paddingHorizontal: 40,
    // paddingTop: 100,
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingTop:10,
    textAlign: 'center',
  },
  hintText: {
    color: theme.colors?.black4,
    textAlign: 'center',
    marginBottom: 25,
    marginTop:5
  },
}));

enum visiblePasswordActionKind {
  VISIBLE_PASSWORD = 'visible_password',
  INVISIBLE_PASSWORD = 'invisible_password',
  VISIBLE_VERIFY_PASSWORD = 'visible_verify_password',
  INVISIBLE_VERIFY_PASSWORD = 'invisible_verify_password',
  TOGGLE_VISIBLE_PASSWORD = 'toggle_password',
  TOGGLE_VISIBLE_VERIFY_PASSWORD = 'toggle_visible_password',
}

interface visiblePasswordAction {
  type: visiblePasswordActionKind;
}

interface visiblePasswordState {
  visiblePassword: boolean;
  visibleVerifyPassword: boolean;
}

const initialState = {
  visiblePassword: false,
  visibleVerifyPassword: false,
};

const reducer = (state: visiblePasswordState, action: visiblePasswordAction) => {
  switch (action.type) {
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

export default function RegisterVerifyCodeScreen(props: RegisterVerifyCodeProps) {
  const { navigation } = props;

  const styles = useStyles(props);
  const { theme } = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const passwordInputRef = useRef<TextInput>(null);
  const methods = useForm();
  const storeDispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = methods;

  const phone = useSelector((rootState: RootState) => rootState.register.phone);
  const onSubmit = async (data: any) => {
    const { verifyCode } = data;
    const res = await userApi.verification({ phone, verifyCode });
    if (res !== 'success') {
      Toast.show('驗證碼錯誤');
    } else {
      navigation.push('RegisterName');
    }
  };

  const [countDown, setCountDown] = useState(30);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countDown]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerShadowVisible: false,
  //     headerStyle: styles.headerStyle,
  //     headerTintColor: theme.colors.white,
  //     headerBackTitleVisible: false,
  //     headerTitleAlign: 'center',
  //     headerTitle: props => {
  //       return <></>;
  //     },
  //   });
  // });

  const onRegisterAgain = async () => {
    setRegisterLoading(true);
    const data = await userApi.phoneRegister({ phone });
    setCountDown(30);
    setRegisterLoading(false);
  };

  return (
    <FormProvider {...methods}>
        <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.outerContainer}>
        <Header containerStyle={{paddingHorizontal:20,}}/>
        <Image
        source={mapIcon.illus3zIcon}
        style={{
          width: 332,
          height: 203,
          position: 'absolute',
          right:0
        }}
      />
          <TitleOne style={styles.titleText}>請輸入驗證碼</TitleOne>
          <CaptionFour style={styles.hintText}>
            {`我們向 ${phone} 傳送了簡訊驗\n證碼，有效時間十分鐘`}
          </CaptionFour>
          <InputField
            ref={passwordInputRef}
            name="verifyCode"
            style={{
              marginBottom: 10,
            }}
            containerStyle={{ paddingHorizontal:40,paddingBottom:24}}
            secureTextEntry={!state.visiblePassword}
            placeholder="輸入驗證碼"
            textContentType="password"
            onSubmit={handleSubmit(onSubmit)}
            keyboardType='number-pad'
            rules={{
              required: '這是必填欄位',
            }}
           styles={{}}
          />
          {countDown > 0 ? (
            <UnChosenButton
              buttonStyle={{
                height: 32,
                width: 260,
                padding: 0,
                marginBottom: 40,
                alignItems: 'center',
           
              }}
              titleStyle={{
                fontSize: fontSize(14),
                color:theme?.colors?.grey6,
                marginLeft: 3,
                textAlign:'center'
              }}
              containerStyle={{ paddingHorizontal:40,alignItems:'center'}}
              style={{ alignSelf: 'center' }}
              title={`我沒有收到驗證碼（00:${countDown < 10 ? '0' : ''}${countDown}）`}
              icon={<AntDesign name="clockcircleo" size={14} color={theme?.colors?.grey6} />}
              iconLeft
            />
          ) : (
            <ChosenButton
              buttonStyle={{
                height: 32,
                width: 170,
                padding: 0,
                // marginBottom: 40,
                alignItems:'center'
              }}
              titleStyle={{
                fontSize: fontSize(14),
                marginLeft: 3,
                color:theme?.colors?.black2,
              }}
              containerStyle={{alignSelf:'center'}}
              style={{ alignItems: 'center' }}
              title="重新獲取驗證碼"
              onPress={onRegisterAgain}
              loading={registerLoading}
              icon={<AntDesign name="clockcircleo" size={14} color={theme?.colors?.black2} />}
              iconLeft
            />
          )}
      </KeyboardAwareScrollView>
          <ButtonTypeTwo title="下一步" containerStyle={{marginHorizontal:40,marginBottom:30}}
           onPress={handleSubmit(onSubmit)} 
           />
        </View>
    </FormProvider>
  );
}
