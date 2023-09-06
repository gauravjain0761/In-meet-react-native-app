import { View, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RegisterInterestScreenProps } from '../../types';
import ProgressBar from '../../components/common/ProgressBar';
import { BodyThree, SubTitleOne, TitleOne } from '../../components/common/Text';
import { ButtonTypeTwo, UnChosenButton } from '../../components/common/Button';

const { height, width } = Dimensions.get('window');
type FormData = {
  selectedInterest: string[];
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
    paddingBottom: 60,
    textAlign: 'center',
  },

  footerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
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

const interests = [
  '運動',
  '健身',
  '美食',
  '寵物',
  '音樂',
  '藝術',
  '喝酒',
  '遊戲',
  '照相',
  '旅遊',
  '唱歌',
  '投資',
  '電影',
  '咖啡',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
];
export default function RegisterInterestScreen(props: RegisterInterestScreenProps) {
  const styles = useStyles(props);
  const { navigation } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      selectedInterest: [],
    },
  });

  const onSubmit = (data: any) => {
    navigation.navigate('RegisterImage');
  };

  const handleSelectInterest = (interest: string, onChange: (e: any) => void, value: string[]) => {
    if (value.length < 5) {
      onChange([...value, interest]);
    } else {
      onChange([...value, interest].slice(1));
    }
  };

  const handleRemoveSelectedInterest = (
    interest: string,
    onChange: (e: any) => void,
    value: string[],
  ) => {
    if (value.includes(interest)) {
      onChange([...value.filter(item => item !== interest)]);
    }
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ minHeight: height }}
      style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <ProgressBar step={5} />
        <View style={styles.bodyContainer}>
          <TitleOne style={styles.titleText}>有哪些興趣？</TitleOne>
          <BodyThree style={styles.bodyText}>挑選興趣, 可尋找興趣相同的他/她</BodyThree>

          <Controller
            name="selectedInterest"
            control={control}
            rules={{
              validate: {
                checkLength: v => v.length > 4 || 'This is too short',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.buttonContainer}>
                {interests.map((interest, index) =>
                  value.includes(interest) ? (
                    <ButtonTypeTwo
                      buttonStyle={styles.buttonStyle}
                      key={interest}
                      onPress={() => handleRemoveSelectedInterest(interest, onChange, value)}
                      title={<SubTitleOne style={styles.chosenButtonText}>{interest}</SubTitleOne>}
                    />
                  ) : (
                    <UnChosenButton
                      buttonStyle={styles.buttonStyle}
                      onPress={() => handleSelectInterest(interest, onChange, value)}
                      key={interest}
                      title={
                        <SubTitleOne style={styles.unchosenButtonText}>{interest}</SubTitleOne>
                      }
                    />
                  ),
                )}
              </View>
            )}
          />
        </View>

        <View style={styles.footerContainer}>
          <ButtonTypeTwo
            title={<SubTitleOne style={styles.chosenButtonText}>下一步</SubTitleOne>}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
