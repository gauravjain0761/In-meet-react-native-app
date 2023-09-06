import { View, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';
import { BodyThree, SubTitleOne, TitleOne } from '../../components/common/Text';
import { ButtonTypeTwo, ChosenButton, UnChosenButton } from '../../components/common/Button';
import { RegisterAddressScreenProps } from '../../types';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppDispatch } from '~/store';
import { updateCity } from '~/store/registerSlice';

const { height, width } = Dimensions.get('window');
type FormData = {
  selectedCity: string;
};

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
    paddingBottom: 40,
    textAlign: 'center',
  },

  footerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    paddingBottom:40
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  buttonContainer: {
    paddingBottom: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    width: (width - 15 - 80) / 2,
    marginBottom: 15,
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  unchosenButtonText: {
    color: theme.colors?.black4,
  },
}));

const cities = [
  '台北市',
  '新北市',
  '基隆市',
  '新竹市',
  '桃園市',
  '新竹縣',
  '宜蘭縣',
  '台中市',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '高雄市',
  '台南市',
  '嘉義市',
  '嘉義縣',
  '屏東縣',
  '澎湖縣',
  '花蓮縣',
  '台東縣',
];

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

export default function RegisterAddressScreen(props: RegisterAddressScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({});
  const selectedCity = watch('selectedCity');
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(data => {
    if (!selectedCity) return;
    dispatch(updateCity(selectedCity));
    navigation.navigate('RegisterImage');
  });

  const handlePressCity = (city: string) => {
    setValue('selectedCity', city);
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ minHeight: height }}
      style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <ProgressBar step={4} />
        <View style={styles.bodyContainer}>
          <TitleOne style={styles.titleText}>居住地區？</TitleOne>
          <BodyThree style={styles.bodyText}>選擇居住地區, 尋找身邊的邂逅</BodyThree>

          <View style={styles.buttonContainer}>
            {Object.entries(mapCity).map(([cityValue, cityName], index) =>
              selectedCity === cityValue ? (
                <ButtonTypeTwo
                  onPress={() => {}}
                  buttonStyle={styles.buttonStyle}
                  key={cityValue}
                  title={<SubTitleOne style={styles.chosenButtonText}>{cityName}</SubTitleOne>}
                />
              ) : (
                <UnChosenButton
                  buttonStyle={styles.buttonStyle}
                  onPress={() => handlePressCity(cityValue)}
                  key={cityValue}
                  title={<SubTitleOne style={styles.unchosenButtonText}>{cityName}</SubTitleOne>}
                />
              ),
            )}
          </View>
        </View>

        <View style={styles.footerContainer}>
          <ButtonTypeTwo
            title={<SubTitleOne style={styles.chosenButtonText}>下一步</SubTitleOne>}
            onPress={onSubmit}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
