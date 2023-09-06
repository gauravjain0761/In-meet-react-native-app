import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Icon, makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { BodyThree, TitleOne } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import InputField from '~/components/common/InputField';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserEmail, selectUserId, updateUser } from '~/store/userSlice';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  subtitleText: {
    color: theme.colors?.white,
    paddingTop: 100,
    paddingBottom: 30,
    textAlign: 'center',
  },

  loginButtonContainer: {
    width: '100%',
  },
  forgetButtonText: {
    color: theme.colors?.black5,
    textAlign: 'center',
    paddingTop: 15,
  },
}));
function EditProfileEmail(props) {
  const { navigation } = props;
  useCustomHeader({ title: '電子信箱', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: user.email || '',
    },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = methods;

  const handlePressLogin = async (data: any) => {
    const { email, verify } = data;
    try {
      if (email !== verify) return;

      await dispatch(updateUser({ userId, email })).unwrap();
      dispatch(patchUserEmail(email));
      navigation.goBack();
    } catch (error) {
    } finally {
    }
  };
  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { paddingVertical: 20, paddingHorizontal: 16 }]}>
          <InputField
            name="email"
            placeholder="請輸入電子郵件"
            rules={{
              required: '這是必填欄位',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '輸入的格式不正確',
              },
            }}
            styles={{}}
          />
          <InputField
            name="verify"
            placeholder="確認電子郵件"
            rules={{
              required: '這是必填欄位',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '輸入的格式不正確',
              },
            }}
            styles={{}}
          />

          <ButtonTypeTwo
            onPress={handleSubmit(handlePressLogin)}
            containerStyle={styles.loginButtonContainer}
            loading={loading}
            title="保存"
          />
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}

export default EditProfileEmail;
