import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Divider } from '@rneui/base';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';
import { BodyThree, CaptionFour } from './common/Text';
import { ChosenButton, UnChosenButton } from './common/Button';
import {
  EducationValue,
  ReligionValue,
  CITYEnum,
  contactType,
  BLOOD_ENUM,
  HeightValue,
} from '~/constants/mappingValue';
import { UN_FILLED, UN_KNOWN } from '~/constants/defaultValue';
import { mapIcon } from '~/constants/IconsMapping';
import { mapContactIcon } from '~/constants/contactIcons';
import { RootState } from '~/store';

const { width } = Dimensions.get('window');
interface IAboutME {
  adjustHeight: (value: number) => void;
  userInfoData?: User;
}

const useStyles = makeStyles((theme) => ({
  labelText: {
    color: theme.colors?.white,
  },
  inputStyle: {
    backgroundColor: theme.colors.black2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  inputSubStyle: {
    backgroundColor: theme.colors.black2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
    width: 170,
  },
  contactBody: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  contactTitle: { paddingLeft: 8, color: theme.colors?.white, width: 80 },
  contactInfo: { paddingLeft: 8, color: theme.colors?.white },
}));

const vipDisplay = '加入VIP即可查看';

export default function AboutMe(props: IAboutME) {
  const { adjustHeight, userInfoData } = props;
  const styles = useStyles();
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const { theme } = useTheme();
  const columns = [
    { title: '名字', value: userInfoData?.name },
    { title: '身高', value: get(HeightValue, userInfoData?.height, UN_FILLED) },
    { title: '血型', value: get(BLOOD_ENUM, userInfoData?.bloodType, UN_FILLED) },
    { title: '星座', value: userInfoData?.constellation },
    { title: '居住地', value: get(CITYEnum, userInfoData?.city, UN_FILLED) },
    { title: '工作', value: userInfoData?.job || UN_FILLED },
    { title: '宗教', value: get(ReligionValue, userInfoData?.religion, UN_FILLED) },
    { title: '教育程度', value: get(EducationValue, userInfoData?.education, UN_FILLED) },
  ];
  const about = userInfoData?.about || UN_FILLED;

  const contacts = [
    {
      title: 'Facebook',
      icon: mapContactIcon.facebookContactIcon(),
      contactInfo: isVIP ? userInfoData?.contactFacebook || UN_FILLED : vipDisplay,
    },
    {
      title: 'Instagram',
      icon: mapContactIcon.instagramContactIcon(),
      contactInfo: isVIP ? userInfoData?.contactIg || UN_FILLED : vipDisplay,
    },
    {
      title: 'Line',
      icon: mapContactIcon.lineContactIcon(),
      contactInfo: isVIP ? userInfoData?.contactLine || UN_FILLED : vipDisplay,
    },
    {
      title: 'WeChat',
      icon: mapContactIcon.weChatContactIcon(),
      contactInfo: isVIP ? userInfoData?.contactWechat || UN_FILLED : vipDisplay,
    },

    {
      title: '信箱',
      icon: mapContactIcon.mailContactIcon(),
      contactInfo: isVIP ? userInfoData?.email || UN_FILLED : vipDisplay,
    },
    {
      title: '電話',
      icon: mapContactIcon.phoneContactIcon(),
      contactInfo: isVIP ? userInfoData?.phone || UN_FILLED : vipDisplay,
    },
  ];

  const onClickCopy = (contactInfo: string) => {
    if (!isVIP) return;
    Clipboard.setString(contactInfo);
    Toast.show(`已複製${contactInfo}`);
  };

  const Input = ({ label, icon, title, iconShow }: any) => {
    return (
      <>
        <BodyThree style={styles.labelText}>{label}</BodyThree>
        <View style={styles.inputStyle}>
          {iconShow && icon}
          <BodyThree style={[styles.labelText, { marginLeft: 5 }]}>{title}</BodyThree>
        </View>
      </>
    );
  };
  const InputSub = ({ label, icon, title, iconShow }: any) => {
    return (
      <View>
        <BodyThree style={styles.labelText}>{label}</BodyThree>
        <View style={styles.inputSubStyle}>
          {iconShow && icon}
          <BodyThree style={[styles.labelText, { marginLeft: 5 }]}>{title}</BodyThree>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, marginHorizontal: 16, marginTop: 16 ,zIndex:-1}}>
      <Input label="居住地區" iconShow={true} icon={mapIcon.locationIcon1({})} title={get(CITYEnum, userInfoData?.city, UN_FILLED)} />
      <Input label="星座" iconShow={true} icon={mapIcon.starIcon1({})} title={userInfoData?.constellation} />
      <Input label="年齡" iconShow={false} title="18 歲" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputSub label="身高" iconShow={false} title="159 cm" />
        <InputSub label="體重" iconShow={false} title="48 kg" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputSub label="血型" iconShow={false} title={get(BLOOD_ENUM, userInfoData?.bloodType, UN_FILLED)} />
        <InputSub label="喝酒" iconShow={false} title="偶爾喝" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputSub label="抽菸習慣" iconShow={false} title="偶爾抽" />
        <InputSub label="職業" iconShow={false} title="學生" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputSub label="抽菸習慣" iconShow={false} title="學生" />
        <InputSub label="年齡" iconShow={false} title="學生" />
      </View>
      <View style={{height:90}}/>
    </ScrollView>
  );
}

// const useStyles = makeStyles(theme => ({
//   text: {
//     color: theme.colors?.white,
//     paddingHorizontal: 16,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//   },
//   rowTitle: { color: theme.colors?.white, width: 60 },
//   aboutMeDivider: {
//     paddingTop: 10,
//   },
//   personalTitle: {
//     color: theme.colors?.black4,
//     paddingTop: 20,
//     paddingBottom: 6,
//     paddingHorizontal: 16,
//   },
//   personalDivider: { paddingTop: 6 },
//   interestChipContainer: {
//     flexWrap: 'wrap',
//     flexDirection: 'row',
//     paddingTop: 10,
//   },
//   interestButtonContainer: {
//     paddingBottom: 10,
//     paddingHorizontal: 16,
//   },
//   interestButton: { height: 24, padding: 0 },
//   interestButtonTitle: {
//     color: theme.colors?.pink,
//   },
//   unfilledText: {
//     color: theme.colors.black4,
//     paddingHorizontal: 16,
//   },
//   container: {
//     paddingTop: 20,
//   },
//   contactContainer: {
//     paddingTop: 20,
//   },
//   contactWrapper: {
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   contactBody: { flex: 1, flexDirection: 'row', alignItems: 'center' },
//   contactTitle: { paddingLeft: 8, color: theme.colors?.white, width: 80 },
//   contactInfo: { paddingLeft: 8, color: theme.colors?.white },
// }));

{
  /* <ScrollView>
<BodyThree style={[styles.text, { paddingTop: 20 }]}>關於我</BodyThree>
<BodyThree
  style={[
    about === UN_FILLED ? styles.unfilledText : styles.text,
    styles.text,
    { paddingTop: 5 },
  ]}>
  {about}
</BodyThree>
<Divider color={theme.colors.black2} style={styles.aboutMeDivider} />
<CaptionFour style={styles.personalTitle}>個人資料</CaptionFour>
{columns.map(column => (
  <View key={column.title}>
    <View style={styles.rowContainer}>
      <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
      <BodyThree style={column.value === UN_FILLED ? styles.unfilledText : styles.text}>
        {column.value}
      </BodyThree>
    </View>
    <Divider color={theme.colors.black2} style={styles.personalDivider} />
  </View>
))}

<View style={styles.rowContainer}>
  <BodyThree style={styles.rowTitle}>興趣</BodyThree>
</View>
<View style={styles.interestChipContainer}>
  {userInfoData?.hobbies?.map(hobby => (
    <ChosenButton
      key={hobby.id}
      style={styles.interestButtonContainer}
      buttonStyle={styles.interestButton}
      title={<CaptionFour style={styles.interestButtonTitle}>{hobby.hobbyName}</CaptionFour>}
    />
  ))}
  {(userInfoData?.hobbies || []).length === 0 && (
    <BodyThree style={styles.unfilledText}>{UN_FILLED}</BodyThree>
  )}
</View>

<View style={styles.container}>
  {contacts.map(contact => (
    <View key={contact.title} style={styles.contactContainer}>
      <View style={styles.contactWrapper}>
        <View style={styles.contactBody}>
          {contact.icon}
          <BodyThree numberOfLines={1} style={styles.contactTitle}>
            {contact.title}
          </BodyThree>
          <BodyThree
            style={
              contact.contactInfo === UN_FILLED ? styles.unfilledText : styles.contactInfo
            }>
            {contact.contactInfo}
          </BodyThree>
        </View>
        <TouchableOpacity onPress={() => onClickCopy(contact.contactInfo)}>
          {mapIcon.copyIcon({ size: 15 })}
        </TouchableOpacity>
      </View>
    </View>
  ))}
</View>
</ScrollView> */
}
