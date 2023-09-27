import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useCustomHeader from '~/hooks/useCustomHeader';
import { CaptionFive, SubTitleTwo } from '~/components/common/Text';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserAbout, selectUserId, updateUser } from '~/store/userSlice';
import { mapIcon } from '~/constants/IconsMapping';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontSize } from '~/helpers/Fonts';
import SafeAreaView from 'react-native-safe-area-view';

const useStyles = makeStyles(theme => ({
  inputStyle: {
    width: '100%',
    backgroundColor: theme.colors?.black2,
    borderWidth: 1,
    borderColor: theme.colors?.black3,
    borderRadius: 20,
    height: 240,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    fontSize: 12,
    color: 'white',
    textAlignVertical: 'top',
    fontWeight: '300',
  },
  textAreaContainer: {
    paddingHorizontal: 16,
  },
  hintText: {
    paddingTop: 7,
    color: theme.colors?.black4,
    textAlign: 'right',
  },
  avatarDisplayName: {
    color: theme.colors?.white,
    fontSize: fontSize(18),
    // marginRight:40
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
}));
function EditProfileAboutMe(props: any) {
  const { navigation } = props;
  const { about = '' } = useSelector((state: RootState) => state.user);
  const { bottom, top } = useSafeAreaInsets();

  const [bodyText, setBodyText] = useState(about || '');
  const { theme } = useTheme();

  // useCustomHeader({ title: '關於我', navigation });
  const dispatch = useAppDispatch();
  const styles = useStyles();

  const userId = useSelector(selectUserId);

  const handlePatchAbout = async () => {
    try {
      if (bodyText.length === 0) return;
      await dispatch(updateUser({ userId, about: bodyText })).unwrap();
      dispatch(patchUserAbout(bodyText));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
    });
  });

  const HeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
          marginTop:top+8,
          backgroundColor:theme.colors.black1
        }}>
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
        <SubTitleTwo style={styles.avatarDisplayName}>{'簡介'}</SubTitleTwo>
        <SubTitleTwo style={[styles.avatarDisplayName,{color:theme.colors.pink}]}>{'確定'}</SubTitleTwo>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.colors.black1}}>
    <HeaderView />
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: theme.colors.black1, paddingTop: 20 }}>
      <View style={styles.textAreaContainer}>
        <TextInput
          onChangeText={setBodyText}
          value={bodyText}
          placeholder="輸入內容"
          multiline
          placeholderTextColor={theme.colors.black4}
          maxLength={300}
          style={styles.inputStyle}
        />
        <CaptionFive style={styles.hintText}>{bodyText.length}/300</CaptionFive>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        <ButtonTypeTwo onPress={handlePatchAbout} title="保存" />
      </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default EditProfileAboutMe;
