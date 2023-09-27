import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import React from 'react';
import { makeStyles, useTheme, Image } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BodyThree, BodyTwo, CaptionFour, SubTitleOne } from '../common/Text';
import { UN_KNOWN } from '../../constants/defaultValue';
import { RootState } from '~/store';
import defaultAvatar from '~/assets/images/icons/defaultAvatar.png';
import { mapIcon } from '~/constants/IconsMapping';
import { useHeaderHeight } from '@react-navigation/elements';
import { Menu } from 'react-native-paper';

const useStyles = makeStyles((theme) => ({
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
    borderWidth: 1,
    borderColor: theme.colors?.white,
    borderRadius: 120,
  },

  title: {
    // textAlign: 'center',
    color: theme.colors?.white,
    // paddingTop: 10,
    // paddingBottom: 10,
    paddingVertical: 11,
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
  const { width, height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const [visible, setVisible] = React.useState(false);

  const renderMenuComponent = () => {
    return (
      <View
        style={{
          position: 'absolute',
          right: 25,
          top: headerHeight + 75,
          width: 210,
          borderRadius: 12,
          backgroundColor: theme.colors.black,
          zIndex:1
        }}>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          style={{ paddingHorizontal: 16 }}>
          <BodyThree style={styles.title}>上傳大頭照</BodyThree>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.black2,
            borderTopColor: theme.colors.black2,
          }}>
          <BodyThree style={[styles.title, { paddingHorizontal: 16 }]}>拍攝大頭照</BodyThree>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          style={{ paddingHorizontal: 16 }}>
          <BodyThree style={styles.title}>編輯生活照</BodyThree>
        </TouchableOpacity>
      </View>
    );
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
        <TouchableOpacity
          style={{
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            right: 8,
            backgroundColor: theme.colors.white,
            borderRadius: 28,
          }}
          onPress={() => {
            setVisible(!visible);
          }}>
          {mapIcon.editIcon({ size: 15, color: theme.colors.black })}
        </TouchableOpacity>

        {/* <SubTitleOne style={styles.title}>{name || UN_KNOWN}</SubTitleOne> */}
      </View>
      {visible && renderMenuComponent()}

      {/* {showSignature && (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <CaptionFour style={{ color: theme.colors.white, textAlign: 'center', paddingRight: 10 }}>
            {signature || UN_KNOWN}
          </CaptionFour>
          <TouchableOpacity onPress={() => navigation.navigate('EditSignatureScreen')}>
            {mapIcon.editIcon({ size: 15 })}
          </TouchableOpacity>
        </View>
      )} */}
    </>
  );
}
