import { View } from 'react-native';
import React, { useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Toast from 'react-native-root-toast';
import { ForgetPasswordScreenProps } from '../../types';
import InputField from '../../components/common/InputField';
import { ButtonTypeTwo } from '../../components/common/Button';
import useCustomHeader from '~/hooks/useCustomHeader';
import HttpClient from '~/axios/axios';
import { ErrorMessage } from '@hookform/error-message';
import { CaptionFour, TitleOne } from '~/components/common/Text';
import { Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '~/components/common/Header';
import { mapIcon } from '~/constants/IconsMapping';
import { useTheme } from '@rneui/themed';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
    // paddingTop: 30,
    // paddingHorizontal: 40,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 28,
    textAlign: 'center',
    paddingTop: 10,
  },
}));

export default function ForgetPasswordScreen(props: ForgetPasswordScreenProps) {
  const { navigation } = props;
  const styles = useStyles(props);
  const { theme } = useTheme();
  const methods = useForm({
    mode: 'onSubmit',
  });
  const [disabledValue, setDisabledValue] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = methods;
  // useCustomHeader({ title: '忘記密碼', navigation });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { phone } = data;
      const res = await HttpClient.get(`/user/ChechPhoneCode?loginPhone=${phone}`);
      navigation.push('ForgetPasswordVerifyMail', {
        email: phone,
        verifyCode: res.data.data,
      });
    } catch (error) {
      Toast.show(JSON.stringify(error));
      setIsLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.outerContainer}>
        <KeyboardAwareScrollView
          // scrollEventThrottle={800}
          // onScroll={onDismissInput}
          style={styles.outerContainer}>
          <View style={styles.container}>
            <Header containerStyle={{ paddingHorizontal: 20 }} />
            <Image
              source={mapIcon.illus3zIcon}
              style={{
                width: 332,
                height: 230,
                position: 'absolute',
                right:0
              }}
            />
            <TitleOne style={styles.titleText}>請輸入電話號碼</TitleOne>
            <InputField
              name="phone"
              label='電話'
              required
              placeholder="請輸入註冊時使用的電話號碼"
              onSubmit={handleSubmit(onSubmit)}
              textContentType="telephoneNumber"
              keyboardType='number-pad'
              rules={{
                required: '這是必填欄位',
                pattern: {
                  value: /((?=(09))[0-9]{10})$/i,
                  message: '輸入的格式不正確',
                },
              }}
              styles={{}}
              containerStyle={{marginHorizontal:40}}

            />
          </View>
        </KeyboardAwareScrollView>

        <ButtonTypeTwo
          // disabled={disabledValue}
          // disabledStyle={{ backgroundColor: theme?.colors?.pink1 }}
          // disabledTitleStyle={{ color: theme?.colors?.white }}
          containerStyle={{ marginHorizontal: 40, marginBottom: 30 }}
          loading={isLoading}
          title="送出"
          onPress={handleSubmit(onSubmit)}
          
        />
      </View>
    </FormProvider>
  );
}
