import { View, Text, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, subYears } from 'date-fns';
import { RegisterBirthScreenProps } from '../../types';
import ProgressBar from '../../components/common/ProgressBar';
import { BodyThree, TitleOne } from '../../components/common/Text';
import InputField from '../../components/common/InputField';
import { ButtonTypeTwo } from '../../components/common/Button';
import { useAppDispatch } from '~/store';
import { updateBirthday } from '~/store/registerSlice';

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
    // justifyContent: 'flex-end',
    paddingHorizontal: 40,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
}));

export default function RegisterBirthScreen(props: RegisterBirthScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const methods = useForm();
  const birthdayRef = useRef<TextInput>(null);
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = methods;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataValue, setDataValue] = useState('');
  const dispatch = useAppDispatch();
  const onSubmit = data => {
    const { birthday } = data;
    if (!birthday) return;
    dispatch(updateBirthday(birthday));
    navigation.push('RegisterAddress');
  };
  useEffect(() => {
    setValue('birthday', dataValue);
  }, [dataValue]);

  const handleOnFocus = () => {
    birthdayRef.current?.blur();

    setShowDatePicker(true);
  };
  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} style={styles.outerContainer}>
        <SafeAreaView style={styles.container}>
          <ProgressBar step={3} />
          <View style={styles.bodyContainer}>
            <TitleOne style={styles.titleText}>您的生日是？</TitleOne>
            <BodyThree style={styles.bodyText}>請正確輸入出生年月日，日後無法再修改</BodyThree>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={{ position: 'absolute', zIndex: 2, width: '100%', height: '100%' }}
                onPress={handleOnFocus}
              />
              <InputField
                value={dataValue}
                name="birthday"
                ref={birthdayRef}
                placeholder="請輸入生日日期"
                textContentType="jobTitle"
                onSubmit={handleSubmit(onSubmit)}
                rules={{
                  required: '這是必填',
                  // pattern: {
                  //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  //   message: '輸入的格式不正確',
                  // },
                }}
                styles={{}}
              />
            </View>
          </View>

          <View style={styles.footerContainer}>
            <ButtonTypeTwo title="下一步" onPress={handleSubmit(onSubmit)} />
          </View>
        </SafeAreaView>
        <DateTimePickerModal
          mode="date"
          maximumDate={subYears(new Date(), 18)}
          isVisible={showDatePicker}
          onConfirm={date => {
            setShowDatePicker(false);

            setDataValue(format(new Date(date), 'yyyy-MM-dd'));
          }}
          onCancel={() => {
            setShowDatePicker(false);
            birthdayRef.current?.blur();
          }}
        />
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
