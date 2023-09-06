import { TextInput,Image, View ,Text } from 'react-native';
import React, { useReducer, useRef } from 'react';
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Feather } from '@expo/vector-icons';
import { ButtonTypeTwo } from '../../components/common/Button';
import { TitleOne } from '../../components/common/Text';
import { ForgetPasswordTwoScreenProps } from '../../types';
import InputField from '../../components/common/InputField';
import { mapIcon } from '../../constants/IconsMapping';

import HttpClient from '~/axios/axios';
import useCustomHeader from '~/hooks/useCustomHeader';
import Header from '~/components/common/Header';
import { fontSize } from '~/helpers/Fonts';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    // paddingHorizontal: 40,
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
  label: {
    color: '#fff',
    marginBottom: 5,
    marginHorizontal:40,
    marginTop:16,
    fontFamily:"roboto",
    fontSize:fontSize(14),
    fontWeight:'400'
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

export default function ForgetPasswordTwoScreen(props: ForgetPasswordTwoScreenProps) {
  const { navigation, route } = props;
  const { email, verifyCode } = route.params;
  const styles = useStyles(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const passwordInputRef = useRef<TextInput>(null);
  const methods = useForm();
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  // useCustomHeader({ title: '忘記密碼', navigation });

  const onSubmit = async (data: any) => {
    const { password, verifyPassword } = data;
    if (password !== verifyPassword) {
      setError('verifyPassword', {
        message: '密碼長度或內容不正確',
      });
      return;
    }
    try {
      await HttpClient.post(
        '/user/forceUpdatePwd',
        {},
        {
          params: {
            account: email,
            password,
            verifyCode,
          },
        },
      );
      navigation.goBack();
      navigation.goBack();
      navigation.goBack();
    } catch (error) {}
  };

  return (
    <FormProvider {...methods}>
        <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.outerContainer}>
      <Header containerStyle={{ paddingHorizontal: 20 }} title='重設密碼'/>
      <Image
        source={mapIcon.illus3zIcon}
        style={{
          width: 332,
          height: 203,
          position: 'absolute',
          right:0
        }}
      />

          <Text style={styles.label}>新密碼</Text>
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
            onRightPress={() =>
              dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_PASSWORD })
            }
            right={
              state.visiblePassword ? (
                <Feather name="eye" size={24} color="#A8ABBD" />
              ) : (
                mapIcon.invisiblePassword()
              )
            }
            containerStyle={{marginHorizontal:40}}
          />
          <Text style={styles.label}>確認密碼</Text>
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
            containerStyle={{marginHorizontal:40}}
            right={
              state.visibleVerifyPassword ? (
                <Feather name="eye" size={24} color="#A8ABBD" />
              ) : (
                mapIcon.invisiblePassword()
              )
            }
          />
      
      </KeyboardAwareScrollView>
          <ButtonTypeTwo
            title="重設密碼"
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 80 }}
            containerStyle={{marginHorizontal:40,marginBottom:30}}
          />
            </View>
    </FormProvider>
  );
}
