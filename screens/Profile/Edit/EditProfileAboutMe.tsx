import { View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useCustomHeader from '~/hooks/useCustomHeader';
import { CaptionFive } from '~/components/common/Text';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { patchUserAbout, selectUserId, updateUser } from '~/store/userSlice';

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
}));
function EditProfileAboutMe(props: any) {
  const { navigation } = props;
  const { about = '' } = useSelector((state: RootState) => state.user);

  const [bodyText, setBodyText] = useState(about || '');
  const { theme } = useTheme();

  useCustomHeader({ title: '關於我', navigation });
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
  return (
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
  );
}

export default EditProfileAboutMe;
