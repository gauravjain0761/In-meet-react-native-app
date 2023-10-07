import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { makeStyles, useTheme, Image } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { CaptionFour, SubTitleOne, SubTitleTwo } from '../common/Text';
import { UN_FILLED, UN_KNOWN } from '../../constants/defaultValue';
import { RootState } from '~/store';
import defaultAvatar from '~/assets/images/icons/defaultAvatar.png';
import { mapIcon } from '~/constants/IconsMapping';
import { CITYEnum } from '~/constants/mappingValue';
import { get } from 'lodash';
import { calculateAge } from '~/helpers/convertDate';
import { fontSize } from '~/helpers/Fonts';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  headerMainStyle:{
   flexDirection:'row',
   alignItems:'center'
  },
  headerInfoContainer: {
    // alignSelf: 'center',
    marginHorizontal:24,
    flexDirection:'row',
    // alignItems:'center'
  },
  penBtnStyle:{
    width: 22,
    height: 22,
    backgroundColor:theme.colors?.white,
    borderRadius: 22,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    right:2
  },
  avatar: {
    width: 84,
    height: 84,
    borderWidth: 1,
    borderColor: theme.colors?.white,
    borderRadius: 84,
  },

  title: {
    color: theme.colors?.white,
    paddingTop: 10,
    fontSize:fontSize(24),
  },
  introText: {
    color: theme.colors?.white,
  },
}));

export default function ProfileHeaderNew({
  headerStyle = {},
  showSignature = false,
}: {
  headerStyle: any;
  showSignature: boolean;
}) {
  const { theme } = useTheme();
  const styles = useStyles();
  const name = useSelector((state: RootState) => state.user.name);
  const birthday = useSelector((state: RootState) => state.user.birthday);
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const city = useSelector((state: RootState) => state.user?.city);
  const signature = useSelector((state: RootState) => state.user.signature);
  const navigation = useNavigation();
  const handlePressAvatar = () => {
    // navigation.navigate('EditProfilePhoto');
    navigation.navigate('ProfileImageScreen');
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
          <TouchableOpacity style={styles.penBtnStyle}>
            {mapIcon.pencilIcon({size:12,color:theme.colors.black })}
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={{marginLeft:15}}>
        <SubTitleOne style={styles.title}>{name || UN_KNOWN}</SubTitleOne>
        <SubTitleTwo style={styles.introText}>
                {calculateAge(birthday)}, {get(CITYEnum, city, UN_FILLED)}
         </SubTitleTwo>
        </View>
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
