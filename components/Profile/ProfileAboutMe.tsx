import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Divider } from '@rneui/base';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, CaptionFive, CaptionFour } from '../common/Text';
import { ChosenButton, UnChosenButton } from '../common/Button';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState } from '../../store';
import { UN_FILLED, UN_KNOWN } from '../../constants/defaultValue';
import {
  BLOOD_ENUM,
  CITYEnum,
  EducationValue,
  GENDEREnum,
  HeightValue,
  ReligionValue,
} from '../../constants/mappingValue';
import ProfileContactDetail from './ProfileContactDetail';
import { convertDate, convertToYYMMDD } from '~/helpers/convertDate';

const { width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: { paddingTop: 20 },
  text: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rowTitle: { color: theme.colors?.white, width: 60 },
  aboutMeDivider: {
    paddingTop: 10,
  },
  personalDivider: { paddingTop: 6 },
  interestChipContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  interestButtonContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  interestButton: { height: 24, padding: 0 },
  interestButtonTitle: {
    color: theme.colors?.pink,
  },
  aboutMeText: {
    color: theme.colors?.black4,
    paddingHorizontal: 16,
  },
  titleRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
    paddingRight: 16,
    paddingVertical: 10,
  },
  editIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfilledText: {
    color: theme.colors.black4,
    paddingHorizontal: 16,
  },
}));

const UN_FILLED_WITH_HEART = '尚未填寫 (填寫完成獲得3顆愛心)';

export default function ProfileAboutMe(props) {
  const { navigationProps } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const {
    name,
    email,
    bloodType,
    birthday,
    gender,
    job,
    education,
    religion,
    constellation,
    city,
    about,
    height,
    hobbies,
  } = useSelector((state: RootState) => state.user);

  const navigation = useNavigation();
  const columns = [
    {
      title: '名字',
      value: name,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileNameScreen',
        });
      },
    },
    {
      title: '電子郵箱',
      value: email || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileEmail',
        });
      },
    },
    {
      title: '性別',
      value: GENDEREnum[gender] || UN_FILLED,
    },
    {
      title: '身高',
      value: height ? HeightValue[String(height)] : UN_FILLED_WITH_HEART,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileHeightScreen',
          addHeart: Boolean(height),
        });
      },
    },
    {
      title: '生日',
      value: convertToYYMMDD(birthday) || UN_FILLED,
    },
    {
      title: '血型',
      value: bloodType ? BLOOD_ENUM[bloodType] : UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileBloodScreen',
        });
      },
    },
    {
      title: '星座',
      value: constellation,
    },
    {
      title: '居住地',
      value: city ? CITYEnum[city] : UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileLocation',
          addHeart: Boolean(city),
        });
      },
    },
    {
      title: '職業',
      value: job || UN_FILLED_WITH_HEART,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileJobScreen',
          addHeart: Boolean(job),
        });
      },
    },
    {
      title: '宗教',
      value: religion ? ReligionValue[religion] : UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileReligionScreen',
        });
      },
    },
    {
      title: '教育程度',
      value: education ? EducationValue[education] : UN_FILLED_WITH_HEART,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileEducation',
          addHeart: Boolean(education),
        });
      },
    },
  ];

  const aboutText = about || UN_FILLED_WITH_HEART;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {columns.map(column => (
        <View key={column.title}>
          <View style={styles.rowContainer}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
              <BodyThree
                style={[
                  styles.text,
                  (column.value === UN_FILLED || column.value === UN_FILLED_WITH_HEART) &&
                    styles.unfilledText,
                ]}>
                {column.value}
              </BodyThree>
            </View>
            {column.onEdit && (
              <TouchableOpacity onPress={column.onEdit} style={styles.editIcon}>
                {mapIcon.editIcon({ size: 16 })}
              </TouchableOpacity>
            )}
          </View>
          <Divider color={theme.colors.black2} style={styles.personalDivider} />
        </View>
      ))}
      <View style={styles.titleRowContainer}>
        <BodyThree style={[styles.text]}>關於我</BodyThree>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfile', {
              screen: 'EditProfileAboutMe',
              addHeart: Boolean(about),
            });
          }}
          style={styles.editIcon}>
          {mapIcon.editIcon({ size: 16 })}
        </TouchableOpacity>
      </View>
      <View style={{ minHeight: 90, justifyContent: 'space-between' }}>
        <CaptionFive
          style={[
            aboutText === UN_FILLED ? styles.unfilledText : styles.text,
            styles.text,
            { paddingTop: 5 },
          ]}>
          {aboutText}
        </CaptionFive>
        <CaptionFive style={[styles.aboutMeText, { textAlign: 'right' }]}>
          {aboutText?.length}/300
        </CaptionFive>
      </View>

      <Divider color={theme.colors.black2} style={styles.aboutMeDivider} />
      <View style={styles.titleRowContainer}>
        <BodyThree style={[styles.text]}>興趣</BodyThree>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfile', {
              screen: 'EditProfileInterestScreen',
              addHeart: hobbies?.filter(hobby => !hobby.isDisable).length === 0,
            });
          }}
          style={styles.editIcon}>
          {mapIcon.editIcon({ size: 16 })}
        </TouchableOpacity>
      </View>
      <View style={styles.interestChipContainer}>
        {hobbies
          ?.filter(hobby => !hobby.isDisable)
          .map(hobby => (
            <ChosenButton
              key={hobby.id}
              containerStyle={styles.interestButtonContainer}
              buttonStyle={styles.interestButton}
              title={
                <CaptionFour style={styles.interestButtonTitle}>{hobby.hobbyName}</CaptionFour>
              }
            />
          ))}
        {(!hobbies || hobbies?.filter(hobby => !hobby.isDisable).length === 0) && (
          <BodyThree style={styles.unfilledText}>{UN_FILLED_WITH_HEART}</BodyThree>
        )}
      </View>

      <View style={styles.titleRowContainer}>
        <BodyThree style={[styles.text]}>聯絡方式</BodyThree>
      </View>

      <ProfileContactDetail navigation={navigationProps} />
    </ScrollView>
  );
}
