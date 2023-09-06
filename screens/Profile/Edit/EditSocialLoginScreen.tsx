import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { BodyThree, TitleOne } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import InputField from '~/components/common/InputField';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserJob, patchUserName, selectUserId, updateUser } from '~/store/userSlice';

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

function EditSocialLoginScreen(props) {
  const { navigation, route } = props;
  const { type } = route.params;
  useCustomHeader({ title: '姓名', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      job: user.job || '',
    },
  });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserId);
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = methods;

  const handlePatchInterests = async (data: any) => {
    const { name } = data;

    try {
      if (name?.length === 0 || !name) return;
      await dispatch(updateUser({ userId, name })).unwrap();
      dispatch(patchUserName(name));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { paddingVertical: 20, paddingHorizontal: 16 }]}>
          <InputField
            name="name"
            placeholder="請輸入..."
            rules={{
              required: '這是必填欄位',
              // pattern: {
              //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //   message: '輸入的格式不正確',
              // },
            }}
            styles={{}}
          />

          <ButtonTypeTwo
            onPress={handleSubmit(handlePatchInterests)}
            containerStyle={styles.loginButtonContainer}
            loading={loading}
            title="保存"
          />
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}

export default EditSocialLoginScreen;
