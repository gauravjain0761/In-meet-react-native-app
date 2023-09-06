import { View, TextInput, Keyboard } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import isEmpty from 'lodash/isEmpty';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { get } from 'lodash';
import { ButtonTypeTwo } from '../../components/common/Button';
import { CaptionFour, TitleOne } from '../../components/common/Text';
import { FastLoginEmailScreenProps } from '~/types';
import { useAppDispatch } from '../../store';
import { patchRegister, updateEmail } from '~/store/registerSlice';
import { userApi } from '~/api/UserAPI';
import { updateAccessToken, updateFastLoginEmail } from '~/store/fastLoginSlice';

// If ios we change the component type and, via the `attrs` method, add a behavior prop. This
// approach leaves Android alone. Because it already works.

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

export default function FastLoginEmailScreen(props: FastLoginEmailScreenProps): JSX.Element {
  const { navigation, route } = props;
  const styles = useStyles(props);
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();
  const handlePressNextStep = () => {
    navigation.push('FastLoginPassWordScreen');
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: get(route, 'params.email', ''),
    },
  });

  const onSubmit = async (data: any) => {
    const { email } = data;
    Keyboard.dismiss();
    if (!email) return;
    dispatch(updateEmail(email));
    handlePressNextStep();
  };

  return (
    <KeyboardAwareScrollView style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <TitleOne style={styles.titleText}>請輸入電子郵件</TitleOne>
        <Controller
          control={control}
          rules={{
            required: 'required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '輸入的格式不正確',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={() => {
                onBlur();
                Keyboard.dismiss();
              }}
              editable={false}
              selectTextOnFocus={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              keyboardAppearance="dark"
              placeholder="請輸入電子郵件"
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholderTextColor={theme.colors.black4}
              style={{
                borderRadius: 30,
                backgroundColor: theme.colors.black2,
                paddingVertical: 15,
                paddingHorizontal: 20,
                color: theme.colors.black3,
                ...(!isEmpty(errors) && {
                  borderColor: theme.colors.pink,
                  borderWidth: 1,
                }),
              }}
            />
          )}
          name="email"
        />
        <View style={{ height: 30, justifyContent: 'center' }}>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <CaptionFour style={{ color: theme.colors.pink, paddingVertical: 8 }}>
                {message}
              </CaptionFour>
            )}
          />
        </View>

        <ButtonTypeTwo title="下一步" onPress={handleSubmit(onSubmit)} />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
