import { View, Text, Image, Alert } from 'react-native';
import React, { useReducer, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { ProfileStackScreenProps } from '../../../navigation/ProfileNavigator';
import useCustomHeader from '../../../hooks/useCustomHeader';
import { CaptionFive, CaptionFour, SubTitleTwo, TitleOne } from '../../../components/common/Text';
import { ButtonTypeTwo, UnChosenButton } from '../../../components/common/Button';
import CommonModalComponent from '../../../components/common/CommonModalComponent';
import ProfileRowItem from '~/components/Profile/ProfileRowItem';
import InputField from '~/components/common/InputField';
import { useAppDispatch } from '~/store';
import { mapIcon } from '~/constants/IconsMapping';
import { userApi } from '~/api/UserAPI';
import { selectToken } from '~/store/userSlice';
import Loader from '~/components/common/Loader';

const useStyles = makeStyles(theme => ({
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
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

export default function ModifyPasswordSetting(
  props: ProfileStackScreenProps<'ModifyPasswordSetting'>,
) {
  const { navigation, route } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const passwordInputRef = useRef<TextInput>(null);
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const storeDispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = methods;

  const { password, verifyPassword } = getValues();
  const token = useSelector(selectToken);
  const onSubmit = async (data: any) => {
    const { password, verifyPassword } = data;
    if (password !== verifyPassword) {
      setError('verifyPassword', {
        message: 'This is not the same value',
      });
      return;
    }
    setLoading(true);
    const oldPassword = get(route, 'params.oldPassword', '');

    try {
      await userApi.updateUserPassword({ token, oldPassword, newPassword: password });
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      Alert.alert('something went wrong', JSON.stringify(error));
    }
    setLoading(false);

    // storeDispatch(updatePassword(password))
  };
  const handleConfirm = () => {
    setCollectionModal(false);
  };
  const handleCancel = () => {
    setCollectionModal(false);
  };
  const handleOpen = () => {
    setCollectionModal(true);
  };
  useCustomHeader({ title: '修改密碼', navigation });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.black1,
        paddingTop: 20,
        paddingHorizontal: 40,
      }}>
      <Loader isLoading={loading}>
        <FormProvider {...methods}>
          <KeyboardAwareScrollView style={styles.outerContainer}>
            <InputField
              ref={passwordInputRef}
              name="password"
              secureTextEntry={!state.visiblePassword}
              placeholder="輸入新密碼"
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
              right={mapIcon.invisiblePassword()}
            />
            <InputField
              name="verifyPassword"
              keyboardType="default"
              secureTextEntry={!state.visibleVerifyPassword}
              textContentType="password"
              placeholder="再次輸入新密碼"
              onSubmit={handleSubmit(onSubmit)}
              rules={{
                required: true,
              }}
              styles={{}}
              onRightPress={() =>
                dispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_VERIFY_PASSWORD })
              }
              right={mapIcon.invisiblePassword()}
            />
            <ButtonTypeTwo title="確認修改" onPress={handleSubmit(onSubmit)} />
          </KeyboardAwareScrollView>
        </FormProvider>
        <CommonModalComponent
          modalText="確定要刪除帳號嗎"
          isVisible={collectionModal}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      </Loader>
    </View>
  );
}
