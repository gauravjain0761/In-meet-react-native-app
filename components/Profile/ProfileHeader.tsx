import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { makeStyles, useTheme, Image } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour, SubTitleOne } from '../common/Text';
import { UN_KNOWN } from '../../constants/defaultValue';
import { RootState } from '~/store';
import defaultAvatar from '~/assets/images/icons/defaultAvatar.png';
import { mapIcon } from '~/constants/IconsMapping';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  headerInfoContainer: {
    alignSelf: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: theme.colors?.white,
    borderRadius: 120,
  },

  title: {
    textAlign: 'center',
    color: theme.colors?.white,
    paddingTop: 10,
    paddingBottom: 10,
  },
}));

export default function ProfileHeader({
  headerStyle = {},
  showSignature = false,
}: {
  headerStyle: any;
  showSignature: boolean;
}) {
  const { theme } = useTheme();
  const styles = useStyles();
  const name = useSelector((state: RootState) => state.user.name);
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const signature = useSelector((state: RootState) => state.user.signature);
  const navigation = useNavigation();
  const handlePressAvatar = () => {
    navigation.navigate('EditProfilePhoto');
  };
  return (
    <>
      <View style={[styles.headerInfoContainer, headerStyle]}>
        <TouchableOpacity onPress={handlePressAvatar}>
          <Image
            style={styles.avatar}
            source={avatar ? { uri: avatar } : defaultAvatar}
            PlaceholderContent={<ActivityIndicator />}
          />
        </TouchableOpacity>
        <SubTitleOne style={styles.title}>{name || UN_KNOWN}</SubTitleOne>
      </View>
      {showSignature && (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <CaptionFour style={{ color: theme.colors.white, textAlign: 'center', paddingRight: 10 }}>
            {signature || UN_KNOWN}
          </CaptionFour>
          <TouchableOpacity onPress={() => navigation.navigate('EditSignatureScreen')}>
            {mapIcon.editIcon({ size: 15 })}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
