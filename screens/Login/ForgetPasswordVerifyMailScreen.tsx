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
  TouchableOpacity,
  Image,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import isEmpty from 'lodash/isEmpty';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as WebBrowser from 'expo-web-browser';

import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { AntDesign } from '@expo/vector-icons';
import { ButtonTypeTwo, ChosenButton, UnChosenButton } from '../../components/common/Button';
import { BodyThree, CaptionFour, TitleOne } from '../../components/common/Text';
import { ForgetPasswordVerifyMailScreenProps, RegisterEmailScreenProps } from '../../types';
import { useAppDispatch } from '../../store';
import { patchRegister, updateEmail } from '~/store/registerSlice';
import { userApi } from '~/api/UserAPI';
import useCustomHeader from '~/hooks/useCustomHeader';
import HttpClient from '~/axios/axios';
import Header from '~/components/common/Header';
import { fontSize } from '~/helpers/Fonts';
import { mapIcon } from '~/constants/IconsMapping';

// If ios we change the component type and, via the `attrs` method, add a behavior prop. This
// approach leaves Android alone. Because it already works.
const ScreenContainer = styled(Platform.OS === 'ios' ? KeyboardAvoidingView : View).attrs({
  behavior: Platform.OS === 'ios' && 'padding',
})`
  flex: 1;
`;

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
  helpContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  helpLink: { color: theme.colors.white, textAlign: 'center' },
  helpLinkText: {
    color: theme.colors?.pink,
    textDecorationLine: 'underline',
  },
  unchosenButtonText: {
    color: theme.colors?.pink,
  },
  hintText: {
    color: theme.colors?.black4,
    textAlign: 'center',
    marginBottom: 24,
    marginTop:20
  },
}));

export default function ForgetPasswordVerifyMailScreen(
  props: ForgetPasswordVerifyMailScreenProps,
): JSX.Element {
  const { navigation, route } = props;
  const styles = useStyles(props);
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { params } = route;
  const { verifyCode, email } = params;
  // useCustomHeader({ title: '忘記密碼', navigation });

  const [stateVerifyCode, setStateVerifyCode] = useState(verifyCode);

  const handlePressNextStep = () => {
    navigation.push('ForgetPasswordTwo', {
      email,
      verifyCode: stateVerifyCode,
    });
  };
  const inputRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: any) => {
    const { code } = data;
    Keyboard.dismiss();

    if (!verifyCode) return;
    if (verifyCode !== code) return;
    handlePressNextStep();
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

  const onRegisterAgain = async () => {
    setRegisterLoading(true);
    const res = await HttpClient.get('/user/CheckPhoneCode', { params: { loginPhone: email } });
    setStateVerifyCode(res.data.data);
    setCountDown(30);
    setRegisterLoading(false);
  };

  return (
    <View style={styles.outerContainer}>

    <KeyboardAwareScrollView style={styles.outerContainer}>
      <Header containerStyle={{ paddingHorizontal: 20 }} title='忘記密碼'/>
      <Image
        source={mapIcon.illus3zIcon}
        style={{
          width: 332,
          height: 203,
          position: 'absolute',
          right:0
        }}
      />
        <CaptionFour style={styles.hintText}>
         {`我們向 ${email} 傳送了簡訊驗\n證碼，有效時間十分鐘`}
        </CaptionFour>
        <Controller
          control={control}
          rules={{}}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={() => {
                onBlur();
                Keyboard.dismiss();
              }}
              ref={inputRef}
              onChangeText={onChange}
              keyboardAppearance="dark"
              placeholder="請輸入驗證碼"
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholderTextColor={theme.colors.black4}
              style={{
                borderRadius: 30,
                backgroundColor: theme.colors.black2,
                paddingVertical: 15,
                marginHorizontal:40,
                marginBottom:24,
                paddingHorizontal: 20,
                color: theme.colors.white,
                ...(!isEmpty(errors) && {
                  borderColor: theme.colors.pink,
                  borderWidth: 1,
                }),
              }}
            />
          )}
          name="code"
        />
        <View style={{ justifyContent: 'center' ,paddingLeft:58,bottom:5}}>
          <ErrorMessage
            errors={errors}
            name="code"
            render={({ message }) => (
              <CaptionFour style={{ color: theme.colors.pink, paddingVertical: 8 }}>
                {message}
              </CaptionFour>
            )}
          />
        </View>
        {countDown > 0 ? (
            <UnChosenButton
              buttonStyle={{
                height: 32,
                width: 205,
                padding: 0,
                marginBottom: 40,
                alignItems: 'center',
                         }}
              titleStyle={{
                fontSize: fontSize(14),
                color:theme?.colors?.grey6,
                marginLeft: 3,
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
                width: 140,
                padding: 0,
                marginBottom: 40,
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
        <ButtonTypeTwo title="下一步" containerStyle={{paddingHorizontal:40,bottom:30}}  onPress={handleSubmit(onSubmit)}   />
    </View>
  );
}
