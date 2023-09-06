import { View, Text, Dimensions, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import React, { Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { Foundation, Entypo, Feather } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, subYears } from 'date-fns';
import RNPickerSelect from 'react-native-picker-select';
import { ceil, isEmpty } from 'lodash';
import { BodyThree, TitleOne } from '../../components/common/Text';
import InputField from '../../components/common/InputField';
import { ButtonTypeTwo, ChosenButton, UnChosenButton } from '../../components/common/Button';
import { RegisterNameScreenProps } from '../../types';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppDispatch } from '~/store';
import {
  updateBirthday,
  updateCity,
  updateGender,
  updateName,
  updatePassword,
} from '~/store/registerSlice';

import { mapIcon } from '~/constants/IconsMapping';
import { calculateAge } from '~/helpers/convertDate';
import { fontSize } from '~/helpers/Fonts';
import CityModal from '~/components/common/CityModal';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors?.black1,
  },
  titleText: {
    color: theme.colors?.white,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bodyText: {
    color: theme.colors?.black4,
    paddingBottom: 60,
    textAlign: 'center',
  },
  footerContainer: {
    flexGrow: 1,
  },
  bodyContainer: {
    paddingHorizontal: 37,
    paddingTop: 20,
  },
  buttonstyle: {
    paddingEnd: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontFamily:'roboto',
    fontSize:fontSize(14)
  },
  description: {
    color: theme.colors.black4,
    marginBottom: 5,
    fontFamily:'roboto',
    fontSize:fontSize(12)
  },
  genderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:12
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

export default function RegisterNameScreen(props: RegisterNameScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const methods = useForm();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    register,
    setValue,
    control,
  } = methods;
  const [selectValue, setSelectValue] = React.useState("");
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const [collectionModal, setCollectionModal] = React.useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const { theme } = useTheme();
  const birthRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleOnFocus = () => {
    birthRef.current?.blur();
    setShowDatePicker(true);
  };
  const onSubmit = (data: any) => {
    const { name, gender, birth, religion, password, verifyPassword } = data;
    if (password !== verifyPassword) {
      setError('verifyPassword', {
        message: '密碼長度或內容不正確',
      });
      return;
    }
    if (!name) return;
    if (birth) {
      const age = calculateAge(birth);
      if (Number(age) < 18) {
        setError('birth', {
          message: '未滿18歲，不可註冊',
        });
        return;
      }
    }
    dispatch(updateName(name));
    dispatch(updateBirthday(birth));
    dispatch(updateCity(religion));
    dispatch(updateGender(gender));
    dispatch(updatePassword(password));

    navigation.push('RegisterImage');
  };

  const handleCancel = () => {
    setCollectionModal(false);
  };

  const mapCity = {
    KLU: '基隆市',
    TPE: '台北市',
    TPH: '新北市',
    TYC: '桃園市',
    HSC: '新竹市',
    HSH: '新竹縣',
    MAL: '苗栗縣',
    TXG: '台中市',
    CWH: '彰化縣',
    NTO: '南投縣',
    YLH: '雲林縣',
    CYI: '嘉義市',
    CHI: '嘉義縣',
    TNN: '台南市',
    KHH: '高雄市',
    IUH: '屏東縣',
    TTT: '台東縣',
    HWC: '花蓮市',
    ILN: '宜蘭縣',
    PEH: '澎湖縣',
    KMN: '金門縣',
    LNN: '連江縣',
  };

  useEffect(() => {
    register('religion', { required: true });
  }, [register]);

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        style={styles.outerContainer}>
        <SafeAreaView style={styles.container}>
        <Image
          source={mapIcon.illus3zIcon}
          style={{
            width: 332,
            height: 203,
            position: 'absolute',
            right:0
          }}
        />
          <ProgressBar step={1} />
          <View style={styles.bodyContainer}>
            <InputField
              name="name"
              label="暱稱"
              required
              description="暱稱可在日後進行修改"
              placeholder="輸入名稱"
              textContentType="none"
              rules={{
                required: '這是必填欄位',
              }}
              styles={{marginTop:8}}
              containerStyle={{paddingBottom:24}}
            />
            <Controller
              name="gender"
              control={control}
              defaultValue="MALE"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>
                    性別
                    <Text style={{ color: theme?.colors?.pink }}> *</Text>
                  </Text>
                  <View style={styles.genderContainer}>
                    {value === 'MALE' ? (
                      <>
                        <ChosenButton
                          title="男性"
                          buttonStyle={{ width: 140,paddingHorizontal:35 }}
                          // titleStyle={{ marginLeft: 0 }}
                          icon={<Foundation name="male-symbol" size={22} color="#FF4E84" />}
                        />
                        <UnChosenButton
                          buttonStyle={{ width: 140,paddingHorizontal:35 }}
                          onPress={() => onChange('FEMALE')}
                          title="女性"
                          // titleStyle={{ marginLeft:0}}
                          icon={<Foundation name="female-symbol" size={22} color="#A8ABBD" />}
                        />
                      </>
                    ) : (
                      <>
                        <UnChosenButton
                          buttonStyle={{ width: 140,paddingHorizontal:35 }}
                          onPress={() => onChange('MALE')}
                          title="男性"
                          // titleStyle={{ marginLeft: 0 }}
                          icon={<Foundation name="male-symbol" size={22} color="#A8ABBD" />}
                        />
                        <ChosenButton
                          buttonStyle={{ width: 140,paddingHorizontal:35 }}
                          title="女性"
                          // titleStyle={{ marginLeft: 0 }}
                          icon={<Foundation name="female-symbol" size={22} color="#FF4E84" />}
                        />
                      </>
                    )}
                  </View>
                </>
              )}
            />
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={{ position: 'absolute', zIndex: 2, width: '100%', height: '100%' }}
                onPress={handleOnFocus}
              />
              <InputField
                name="birth"
                label="生日"
                required
                description="請輸入正確的出生年月日，註冊完成後無法修改"
                placeholder="輸入生日日期"
                textContentType="jobTitle"
                rules={{
                  required: '這是必填欄位',
                }}
                styles={{marginTop:8}}
                containerStyle={{paddingBottom:24}}
              />
            </View>
            <View>
              <Text style={styles.label}>
                地區
                <Text style={{ color: theme?.colors?.pink }}> *</Text>
              </Text>
              <View
                style={{
                  alignSelf: 'center',
                  borderRadius: 30,
                  backgroundColor: theme.colors.black2,
                  paddingVertical: Platform.OS =='ios' ? 15: 3,
                  alignItems: 'center',
                  display: 'flex',
                  paddingHorizontal: 20,
                  width: '100%',
                  marginBottom: 24,
                  ...(!isEmpty(errors.religion) && {
                    borderColor: theme.colors.pink,
                    borderWidth: 1,
                  }),
                  flexDirection:'row'
                }}>
                {/* <RNPickerSelect
                  onValueChange={value => 
                   { console.log(value)
                    
                    setValue('religion', value)}}
                  placeholder={{
                    label: '選擇居住地區',
                    value: null,
                    color: '#9EA0A4',
                  }}
                  style={{
                    inputIOS: { color: theme.colors.white },
                    inputAndroid: { color: theme.colors.white },
                  }}
                  items={Object.entries(mapCity).map(([cityValue, cityName]) => ({
                    label: cityName,
                    value: cityValue,
                  }))}
                  Icon={() => <Entypo name="chevron-down" size={20} color="#9EA0A4" />}
                /> */}
                <Text style={{flex:1,color:selectValue !== "" ? theme?.colors?.white : theme?.colors?.black4,paddingVertical:15,fontFamily:"roboto"}}>{selectValue !== "" ? selectValue:"選擇居住地區"}</Text>
                <TouchableOpacity onPress={()=>{
                  setCollectionModal(true)
                }}>
                <Entypo name="chevron-down" size={20} color="#9EA0A4" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.label}>
              設定密碼
              <Text style={{ color: theme?.colors?.pink }}> *</Text>
            </Text>
            <Text style={styles.description}>請輸入8位以上</Text>
            <InputField
              ref={passwordInputRef}
              name="password"
              secureTextEntry={!state.visiblePassword}
              placeholder="輸入密碼"
              textContentType="oneTimeCode"
              rules={{
                required: '這是必填欄位',
                minLength: 8,
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: '輸入的格式不正確',
                // },
              }}
              styles={{marginTop:8}}
              containerStyle={{paddingBottom:16}}
              onRightPress={() =>
                reducerDispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_PASSWORD })
              }
              right={
                state.visiblePassword ? (
                  <Feather name="eye" size={24} color="#A8ABBD" />
                ) : (
                  mapIcon.invisiblePassword()
                )
              }
            />
            <InputField
              name="verifyPassword"
              keyboardType="default"
              secureTextEntry={!state.visibleVerifyPassword}
              textContentType="oneTimeCode"
              placeholder="請再次輸入密碼"
              rules={{
                required: true,
                minLength: 8,
              }}
              onRightPress={() =>
                reducerDispatch({ type: visiblePasswordActionKind.TOGGLE_VISIBLE_VERIFY_PASSWORD })
              }
              right={
                state.visibleVerifyPassword ? (
                  <Feather name="eye" size={24} color="#A8ABBD" />
                ) : (
                  mapIcon.invisiblePassword()
                )
              }
              containerStyle={{paddingBottom:40}}
            />
            <View style={styles.footerContainer}>
              <ButtonTypeTwo
                title="下一步"
                onPress={handleSubmit(onSubmit)}
                style={styles.buttonstyle}
              />
            </View>
          </View>
        </SafeAreaView>
        <DateTimePickerModal
          mode="date"
          isVisible={showDatePicker}
          onConfirm={date => {
            setShowDatePicker(false);
            setValue('birth', format(new Date(date), 'yyyy-MM-dd'));
          }}
          onCancel={() => {
            setShowDatePicker(false);
            birthRef.current?.blur();
          }}
        />
      <CityModal
        modalText="選擇居住地區"
        isVisible={collectionModal}
        data={Object.entries(mapCity).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value:any)=>{
          setValue('religion', value?.value)
          setSelectValue(value.label)
          setCollectionModal(false)
        }}
        onClose={handleCancel}
      />
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
