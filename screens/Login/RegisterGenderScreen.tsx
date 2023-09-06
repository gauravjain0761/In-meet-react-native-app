import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/common/ProgressBar';
import { TitleOne } from '../../components/common/Text';
import InputField from '../../components/common/InputField';
import { RegisterGenderScreenProps } from '../../types';
import {
  ButtonTypeFourChosen,
  ButtonTypeTwo,
  ChosenButton,
  UnChosenButton,
} from '../../components/common/Button';
import { makeStyles } from '@rneui/themed';
import { useAppDispatch } from '~/store';
import { updateGender } from '~/store/registerSlice';

const useStyles = makeStyles((theme) => ({
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
    paddingBottom: 80,
    textAlign: 'center',
  },

  footerContainer: {
    flexGrow: 1,
    // justifyContent: 'flex-end',
    paddingVertical: 30,
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

export default function RegisterGenderScreen(props: RegisterGenderScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const [gender, setGender] = useState('MALE');
  const dispatch = useAppDispatch()
  const onSubmit = () => {
    dispatch(updateGender(gender))
    navigation.push('RegisterBirth');
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <ProgressBar step={2} />
        <View style={styles.bodyContainer}>
          <TitleOne style={styles.titleText}>您的性別是？</TitleOne>
          <View style={styles.buttonContainer}>
            {gender === 'MALE' ? (
              <ChosenButton title="男性" />
            ) : (
              <UnChosenButton onPress={() => setGender('MALE')} title="男性" />
            )}
          </View>

          {gender === 'FEMALE' ? (
            <ChosenButton title="女性" />
          ) : (
            <UnChosenButton onPress={() => setGender('FEMALE')} title="女性" />
          )}
        </View>

        <View style={styles.footerContainer}>
          <ButtonTypeTwo title="下一步" onPress={onSubmit} />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
