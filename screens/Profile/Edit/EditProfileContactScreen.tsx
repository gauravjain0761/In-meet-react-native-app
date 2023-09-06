import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Icon, makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { get } from 'lodash';
import { BodyThree, TitleOne } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import InputField from '~/components/common/InputField';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserJob, patchUserSocialLogin, selectUserId, updateUser } from '~/store/userSlice';
import { contactType } from '~/constants/mappingValue';
import { EditProfileStackProps } from '~/navigation/EditProfileNavigator';

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
function EditProfileContactScreen(props: EditProfileStackProps<'EditProfileContactScreen'>) {
  const { navigation, route } = props;
  useCustomHeader({ title: get(route, 'params.contactTitle'), navigation });
  const styles = useStyles();
  const type = get(route, 'params.contactType', '') as contactType;

  const user = useSelector((state: RootState) => state.user);
  const mapContact = {
    [contactType.FACEBOOK]: user.contactFacebook,
    [contactType.INSTAGRAM]: user.contactIg,
    [contactType.LINE]: user.contactLine,
    [contactType.WECHAT]: user.contactWechat,
    [contactType.PHONE]: user.phone,
  };
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      contactInfo: mapContact[type] || '',
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
    const { contactInfo } = data;
    if (!type) return;
    try {
      if (contactInfo?.length === 0 || !contactInfo) return;
      const contactData = {
        ...(type === contactType.FACEBOOK && { contactFacebook: contactInfo }),
        ...(type === contactType.LINE && { contactLine: contactInfo }),
        ...(type === contactType.INSTAGRAM && { contactIg: contactInfo }),
        ...(type === contactType.WECHAT && { contactWechat: contactInfo }),
        ...(type === contactType.PHONE && { phone: contactInfo }),
      };
      await dispatch(updateUser({ userId, ...contactData })).unwrap();

      dispatch(patchUserSocialLogin({ type, data: contactData }));
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
            name="contactInfo"
            placeholder="請輸入..."
            rules={{
              required: '這是必填欄位',
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

export default EditProfileContactScreen;
