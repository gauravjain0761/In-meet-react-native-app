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
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, FormProvider } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import isEmpty from 'lodash/isEmpty';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { ButtonTypeTwo } from '../../components/common/Button';
import { CaptionFour, TitleOne } from '../../components/common/Text';
import { FastLoginPassWordScreenProps } from '../../types';
import InputField from '../../components/common/InputField';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '~/store';
import { updatePassword } from '~/store/registerSlice';
import useRequestLocation from '~/hooks/useRequestLocation';
import { getUserInfo, socialLoginUser } from '~/store/userSlice';
import { storeUserToken } from '~/storage/userToken';

const useStyles = makeStyles(theme => ({
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

export default function FastLoginPassWordScreen(props: FastLoginPassWordScreenProps) {
  const { navigation } = props;

  const styles = useStyles(props);
  const { theme } = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const passwordInputRef = useRef<TextInput>(null);

  const methods = useForm({
    defaultValues: {
      password: '',
    },
  });
  const storeDispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    watch,
  } = methods;
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data: any) => {
    const { password, verifyPassword } = data;
    if (password !== verifyPassword) {
      setError('verifyPassword', {
        message: '密碼長度或內容不正確',
      });
      return;
    }
    try {
      setLoading(true);
      storeDispatch(updatePassword(password));
      navigation.push('RegisterName');
    } catch (error) {
      Toast.show(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView style={styles.outerContainer}>
        <SafeAreaView style={styles.container}>
          <TitleOne style={styles.titleText}>請輸入密碼</TitleOne>
          <InputField
            ref={passwordInputRef}
            name="password"
            secureTextEntry={!state.visiblePassword}
            placeholder="輸入密碼"
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
              dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_PASSWORD })
            }
            right={mapIcon.invisiblePassword()}
          />
          <InputField
            name="verifyPassword"
            keyboardType="default"
            secureTextEntry={!state.visibleVerifyPassword}
            textContentType="password"
            placeholder="再次確認密碼"
            onSubmit={handleSubmit(onSubmit)}
            rules={{
              required: true,
            }}
            styles={{}}
            onRightPress={() =>
              dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_VERIFY_PASSWORD })
            }
            rightIconShow={true}
            right={mapIcon.invisiblePassword()}
          />
          <ButtonTypeTwo loading={loading} title="下一步" onPress={handleSubmit(onSubmit)} />
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
