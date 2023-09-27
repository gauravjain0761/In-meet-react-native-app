import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Divider } from '@rneui/base';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, CaptionFive, CaptionFour } from '../common/Text';
import { ButtonTypeTwo, ChosenButton, UnChosenButton } from '../common/Button';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '../../store';
import { UN_FILLED, UN_KNOWN } from '../../constants/defaultValue';
import {
  BLOOD_ENUM,
  CITYEnum,
  EducationList,
  EducationValue,
  GENDEREnum,
  HeightValue,
  ReligionValue,
  bloodList,
  drinkingHabits,
  mapCity,
  smokingHabits,
} from '../../constants/mappingValue';
import ProfileContactDetail from './ProfileContactDetail';
import { convertDate, convertToYYMMDD } from '~/helpers/convertDate';
import matchBg from '../../assets/images/icons/matchBg.png';
import { fontSize } from '~/helpers/Fonts';
import CityModal from '../common/CityModal';
import { patchUserBloodType, patchUserCity, selectUserId, updateUser } from '~/store/userSlice';
import Toast from 'react-native-root-toast';

const { width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  container: { paddingTop: 20 },
  text: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowTitle: { color: theme.colors?.white, width: 75 },
  aboutMeDivider: {
    paddingTop: 10,
  },
  personalDivider: { paddingTop: 0 },
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
    paddingVertical: 10,
    marginBottom: 50,
  },

  footerContainer: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 18,
    paddingVertical: 5,
    backgroundColor: theme.colors.black2,
  },
  unfilledText: {
    color: theme.colors.black4,
    paddingHorizontal: 16,
  },
  buttonStyle: {
    // height: 40,
    // width: 168,
  },
  textStyle: {
    fontSize: fontSize(14),
  },
}));

const UN_FILLED_WITH_HEART = '尚未填寫 (填寫完成獲得3顆愛心)';

export default function ProfileAboutDetails(props) {
  const { navigationProps } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const {
    name,
    email,
    bloodType: bloodTypeStore,
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
  const [collectionModal, setCollectionModal] = React.useState(false);
  const [bloodListModal, setBloodListModal] = React.useState(false);
  const [drinkingHabitsModal, setDrinkingHabitsModal] = React.useState(false);
  const [smokingHabitsModal, setSmokingHabitsModal] = React.useState(false);
  const [religionModal, setReligionModal] = React.useState(false);
  const [educationModal, setEducationModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const [localCity, setLocalCity] = useState(city || '');
  const [bloodType, setBloodType] = useState(bloodTypeStore || '');

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

  const profileData = [
    { label: '暱稱', name: name, id: 1, filed: 'input' },
    {
      label: '簡介',
      name: about,
      id: 2,
      filed: 'Btn',
      onEdit: () => {
        //@ts-ignore
        navigation.navigate('EditProfile', {
          screen: 'EditProfileAboutMe',
          addHeart: Boolean(about),
        });
      },
    },
    { label: '身高', name: height, id: 3, filed: 'input' },
    { label: '體重', name: '尚未填寫', id: 4, filed: 'input' },
    {
      label: '血型',
      name: bloodType ? BLOOD_ENUM[bloodType] : UN_FILLED,
      id: 5,
      filed: 'Btn',
      onEdit: () => {
        //@ts-ignore
        setBloodListModal(true);
      },
    },
    { label: '生日', name: convertToYYMMDD(birthday), id: 6, filed: 'Btn' },
    {
      label: '居住地',
      name: city ? CITYEnum[localCity] : UN_FILLED,
      id: 7,
      filed: 'Btn',
      onEdit: () => {
        //@ts-ignore
        setCollectionModal(true);
      },
    },
  ];
  const profileData1 = [
    {
      label: '喝酒',
      name: '滴酒不沾',
      id: 1,
      filed: 'Btn',
      onEdit: () => {
        setDrinkingHabitsModal(true);
      },
    },

    { label: '抽菸', name: '偶爾抽', filed: 'Btn', id: 2 },
    { label: '職業', name: job || UN_FILLED_WITH_HEART, id: 3 },
    {
      label: '宗教',
      name: religion ? ReligionValue[religion] : UN_FILLED,
      id: 4,
      onEdit: () => {
        setReligionModal(true);
      },
    },
    {
      label: '教育程度',
      name: education ? EducationValue[education] : UN_FILLED_WITH_HEART,
      id: 5,
      onEdit:()=>{
        setEducationModal(true);
      }
    },
  ];

  const aboutText = about || UN_FILLED_WITH_HEART;

  const handleCancel = () => {
    setCollectionModal(false);
    setBloodListModal(false);
    setDrinkingHabitsModal(false);
    setSmokingHabitsModal(false);
    setReligionModal(false);
    setEducationModal(false);

  };

  const handlePatchInterests = async (value: any) => {
    try {
      await dispatch(updateUser({ userId, city: value.value })).unwrap();
      dispatch(patchUserCity(localCity));
      setLocalCity(value.value);
      setCollectionModal(false);
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  const handlebloodListModal = async (value: any) => {
    try {
      await dispatch(updateUser({ userId, bloodType })).unwrap();
      dispatch(patchUserBloodType(bloodType));
      // setLocalCity(value.value)
      setBloodListModal(false);
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRowContainer}>
        <BodyThree style={[styles.text]}>
          <Text style={{ color: theme.colors.pink }}>{'* '}</Text>關於我
        </BodyThree>
        <View style={styles.footerContainer}>
          {profileData.map((column) => {
            let lastElement = profileData[profileData.length - 1];
            return (
              <View key={column.label}>
                <View style={styles.rowContainer}>
                  <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                    <BodyThree style={styles.rowTitle}>{column.label}</BodyThree>
                    {column.filed === 'input' ? (
                      <TextInput
                        value={column.name}
                        style={[
                          {
                            color: theme.colors.white,
                            paddingHorizontal: 16,
                            fontSize: fontSize(14),
                          },
                          (column.name === UN_FILLED ||
                            column.name === UN_FILLED_WITH_HEART ||
                            column.label == '生日') &&
                            styles.unfilledText,
                        ]}
                      />
                    ) : (
                      <TouchableOpacity onPress={column?.onEdit} style={{ flex: 1 }}>
                        <BodyThree
                          numberOfLines={2}
                          style={[
                            styles.text,
                            { flex: 1 },
                            (column.name === UN_FILLED ||
                              column.name === UN_FILLED_WITH_HEART ||
                              column.label == '生日') &&
                              styles.unfilledText,
                          ]}>
                          {column.name}
                        </BodyThree>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {lastElement.label !== column.label && (
                  <Divider color={theme.colors.black3} style={styles.personalDivider} />
                )}
              </View>
            );
          })}
        </View>
        <BodyThree style={[styles.text, { marginTop: 20 }]}>
          <Text style={{ color: theme.colors.pink }}>{'* '}</Text>生活方式
        </BodyThree>
        <View style={styles.footerContainer}>
          {profileData1.map((column) => {
            let lastElement = profileData1[profileData1.length - 1];
            return (
              <View key={column.label}>
                <View style={styles.rowContainer}>
                  <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                    <BodyThree style={styles.rowTitle}>{column.label}</BodyThree>
                    {column.filed === 'input' ? (
                      <TextInput
                        value={column.name}
                        style={[
                          {
                            color: theme.colors.white,
                            paddingHorizontal: 16,
                            fontSize: fontSize(14),
                          },
                          (column.name === UN_FILLED ||
                            column.name === UN_FILLED_WITH_HEART ||
                            column.label == '生日') &&
                            styles.unfilledText,
                        ]}
                      />
                    ) : (
                      <TouchableOpacity onPress={column?.onEdit} style={{ flex: 1 }}>
                        <BodyThree
                          numberOfLines={2}
                          style={[
                            styles.text,
                            { flex: 1 },
                            (column.name === UN_FILLED ||
                              column.name === UN_FILLED_WITH_HEART ||
                              column.label == '生日') &&
                              styles.unfilledText,
                          ]}>
                          {column.name}
                        </BodyThree>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {lastElement.label !== column.label && (
                  <Divider color={theme.colors.black3} style={styles.personalDivider} />
                )}
              </View>
            );
          })}
        </View>
      </View>
      <ImageBackground
        source={matchBg}
        resizeMode="cover"
        style={{ width: '100%', height: 70, paddingBottom: 20 }}>
        <ButtonTypeTwo
          containerStyle={[
            styles.buttonStyle,
            { marginBottom: 10, marginTop: 10, marginHorizontal: 50 },
          ]}
          buttonStyle={{ height: 50 }}
          titleStyle={styles.textStyle}
          title="立刻加入"
          // onPress={handleConfirm}
        />
      </ImageBackground>
      <CityModal
        modalText="選擇居住地區"
        isVisible={collectionModal}
        data={Object.entries(mapCity).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          handlePatchInterests(value);
        }}
        onClose={handleCancel}
      />
      <CityModal
        modalText="選擇血型"
        isVisible={bloodListModal}
        data={Object.entries(bloodList).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          handlebloodListModal(value);
        }}
        onClose={handleCancel}
      />
      <CityModal
        modalText="選擇喝酒習慣"
        isVisible={drinkingHabitsModal}
        data={Object.entries(drinkingHabits).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          // handlebloodListModal(value);
          setDrinkingHabitsModal(false);
        }}
        onClose={handleCancel}
      />
      <CityModal
        modalText="選擇喝酒習慣"
        isVisible={smokingHabitsModal}
        data={Object.entries(smokingHabits).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          // handlebloodListModal(value);
          setSmokingHabitsModal(false);
        }}
        onClose={handleCancel}
      />
      <CityModal
        modalText="選擇宗教"
        isVisible={religionModal}
        data={Object.entries(ReligionValue).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          // handlebloodListModal(value);
          setReligionModal(false);
        }}
        onClose={handleCancel}
      />
      <CityModal
        modalText="選擇教育程度"
        isVisible={educationModal}
        data={Object.entries(EducationList).map(([cityValue, cityName]) => ({
          label: cityName,
          value: cityValue,
        }))}
        onConfirm={(value: any) => {
          // handlebloodListModal(value);
          setEducationModal(false);
        }}
        onClose={handleCancel}
      />
      {/* <ProfileContactDetail navigation={navigationProps} /> */}
    </ScrollView>
  );
}
