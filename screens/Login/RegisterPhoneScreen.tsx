import { View, Text, TextInput, KeyboardAvoidingView, Keyboard, Platform, Image } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import isEmpty from 'lodash/isEmpty';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as WebBrowser from 'expo-web-browser';

import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { ButtonTypeTwo } from '../../components/common/Button';
import { BodyThree, CaptionFour, TitleOne } from '../../components/common/Text';
import { RegisterPhoneScreenProps } from '../../types';
import { useAppDispatch } from '../../store';
import { patchRegister, updatePhone } from '~/store/registerSlice';
import { userApi } from '~/api/UserAPI';
import { updateAccessToken } from '~/store/fastLoginSlice';
import { recoverUser } from '~/store/userSlice';
import Header from '~/components/common/Header';
import { mapIcon } from '~/constants/IconsMapping';
import { fontSize } from '~/helpers/Fonts';

// If ios we change the component type and, via the `attrs` method, add a behavior prop. This
// approach leaves Android alone. Because it already works.
const ScreenContainer = styled(Platform.OS === 'ios' ? KeyboardAvoidingView : View).attrs({
  behavior: Platform.OS === 'ios' && 'padding',
})`
  flex: 1;
`;

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
    paddingBottom: 28,
    textAlign: 'center',
    paddingTop:10
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
  label: {
    color: '#fff',
    marginBottom: 5,
    fontFamily:'roboto',
    fontSize:fontSize(14)
  },
}));

export default function RegisterPhoneScreen(props: RegisterPhoneScreenProps): JSX.Element {
  const { navigation } = props;
  const styles = useStyles(props);
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledValue, setDisabledValue] = useState(true);
  const handlePressNextStep = () => {
    navigation.push('RegisterVerifyCode');
  };
  const handleRecover = async (data: any) => {
    await dispatch(recoverUser(data));
    Toast.show('帳號已恢復，請直接登入！');
    navigation.push('Login');
  };
  const inputRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      phone: '',
    },
  });
  
  const onSubmit = async (data: any) => {
    const { phone } = data;
    Keyboard.dismiss();

    if (!phone) return;
    try {
      setIsLoading(true);
      // const isAvailable = await userApi.checkEmailAvailable({ phone });
      // if (isAvailable == 'NOT_AVAILABLE') {
      //   setError(
      //     'phone',
      //     {
      //       message: 'phone 已經被註冊過',
      //     },
      //     { shouldFocus: false },
      //   );
      //   return;
      // }
      // if (isAvailable == 'RECOVER') {
      //   handleRecover(phone);
      //   return;
      // }

      const res = await userApi.phoneRegister({ phone });
      if (res.err) {
        Toast.show(res.err);
        return;
      }
      handlePressNextStep();
      dispatch(updatePhone(phone));
      dispatch(updateAccessToken({ accessToken: '' }));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <View  style={styles.outerContainer}>
    <KeyboardAwareScrollView
      // scrollEventThrottle={800}
      // onScroll={onDismissInput}
      style={styles.outerContainer}>
      <View style={styles.container}>
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
        <TitleOne style={styles.titleText}>請輸入電話號碼</TitleOne>
        <Controller
          control={control}
          rules={{
            required: '這是必填欄位',
            pattern: {
              value: /((?=(09))[0-9]{10})$/i,
              message: '輸入的格式不正確',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{paddingHorizontal:40}}> 
              <Text style={styles.label}>
                電話
                <Text style={{ color: theme?.colors?.pink }}> *</Text>
              </Text>
              <TextInput
                value={value}
                onBlur={() => {
                  onBlur();
                  Keyboard.dismiss();
                }}
                ref={inputRef}
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                onChangeText={(text)=>{
                  onChange(text)
                  if(text.length >1 ) setDisabledValue(false)

                }}
                keyboardAppearance="dark"
                placeholder="請輸入電話號碼"
                onSubmitEditing={handleSubmit(onSubmit)}
                placeholderTextColor={theme.colors.black4}
                style={{
                  borderRadius: 30,
                  backgroundColor: theme.colors.black2,
                  paddingVertical: 15,
                  fontFamily:'roboto',
                  fontSize:fontSize(14),
                  paddingHorizontal: 20,
                  color: theme.colors.white,
                  ...(!isEmpty(errors) && {
                    borderColor: theme.colors.pink,
                    borderWidth: 1,
                  }),
                }}
              />
            </View>
          )}
          name="phone"
        />
        <View style={{ justifyContent: 'center' ,paddingLeft:58,bottom:5}}>
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => (
              <CaptionFour style={{ color: theme.colors.pink, paddingVertical: 8 }}>
                {message}
              </CaptionFour>
            )}
          />
        </View>

      </View>
    </KeyboardAwareScrollView>
      <ButtonTypeTwo disabled={disabledValue} disabledStyle={{backgroundColor:theme?.colors?.pink1,}}  disabledTitleStyle={{color:theme?.colors?.white}} containerStyle={{paddingHorizontal:40,paddingBottom:30}} loading={isLoading} title="下一步" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync('https://inmeet.vip/terms-of-use');
}
