import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, CaptionFour } from '../common/Text';
import { UnChosenButton } from '../common/Button';
import { mapContactIcon } from '../../constants/contactIcons';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState } from '~/store';
import { UN_FILLED } from '~/constants/defaultValue';
import { contactType } from '~/constants/mappingValue';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: 20,
  },
  contactContainer: {
    paddingTop: 20,
  },
  contactWrapper: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactBody: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  contactTitle: { paddingLeft: 8, color: theme.colors?.white, width: 80 },
  contactInfo: { paddingLeft: 8, color: theme.colors?.white },
  unfilledText: {
    paddingLeft: 8,
    color: theme.colors.black4,
  },
}));

export default function ProfileContactDetail(props) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles();
  const {
    facebook,
    line,
    apple,
    email,
    google,
    phone,
    contactFacebook,
    contactIg,
    contactLine,
    contactWechat,
  } = useSelector((state: RootState) => state.user);
  const contacts = [
    {
      title: 'Facebook',
      icon: mapContactIcon.facebookContactIcon(),
      contactInfo: contactFacebook || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileContactScreen',
          params: {
            contactTitle: 'Facebook',
            contactType: contactType.FACEBOOK,
          },
        });
      },
    },
    {
      title: 'Instagram',
      icon: mapContactIcon.instagramContactIcon(),
      contactInfo: contactIg || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileContactScreen',
          params: {
            contactTitle: 'Instagram',
            contactType: contactType.INSTAGRAM,
          },
        });
      },
    },
    {
      title: 'Line',
      icon: mapContactIcon.lineContactIcon(),
      contactInfo: contactLine || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileContactScreen',
          params: {
            contactTitle: 'Line',
            contactType: contactType.LINE,
          },
        });
      },
    },
    {
      title: 'WeChat',
      icon: mapContactIcon.weChatContactIcon(),
      contactInfo: contactWechat || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileContactScreen',
          params: {
            contactTitle: 'WeChat',
            contactType: contactType.WECHAT,
          },
        });
      },
    },

    {
      title: '信箱',
      icon: mapContactIcon.mailContactIcon(),
      contactInfo: email || UN_FILLED,
    },
    {
      title: '電話',
      icon: mapContactIcon.phoneContactIcon(),
      contactInfo: phone || UN_FILLED,
      onEdit: () => {
        navigation.navigate('EditProfile', {
          screen: 'EditProfileContactScreen',
          params: {
            contactTitle: '電話',
            contactType: contactType.PHONE,
          },
        });
      },
    },
  ];

  return (
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
            {contact.onEdit && (
              <TouchableOpacity onPress={contact.onEdit}>
                {mapIcon.editIcon({ size: 15 })}
              </TouchableOpacity>
            )}
          </View>
          <Divider color={theme.colors.black2} style={{ paddingTop: 20 }} />
        </View>
      ))}
    </View>
  );
}
