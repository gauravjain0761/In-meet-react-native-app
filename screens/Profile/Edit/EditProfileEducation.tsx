import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider, Icon, makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { BodyThree } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import { patchUserEducation, selectUserId, updateUser } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';
import useProfileEducation from '~/hooks/useProfileEducation';
import { ButtonTypeTwo } from '~/components/common/Button';

const useStyles = makeStyles(theme => ({
  container: { paddingTop: 20 },
  text: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rowTitle: { color: theme.colors?.white, width: 60 },
  aboutMeDivider: {
    paddingTop: 10,
  },
  personalDivider: { paddingTop: 6 },
}));
function EditProfileEducation(props) {
  const { navigation } = props;
  useCustomHeader({ title: '教育程度', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const [options] = useProfileEducation();
  const education = useSelector((state: RootState) => state.user.education);
  const dispatch = useAppDispatch();
  const [selectedEducation, setSelectedEducation] = useState(education || '');
  const userId = useSelector(selectUserId);
  const handlePatchAbout = async () => {
    try {
      await dispatch(updateUser({ userId, education: selectedEducation })).unwrap();
      dispatch(patchUserEducation(selectedEducation));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  const columns = [...options];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      {columns.map(column => (
        <View key={column.label}>
          <View style={styles.rowContainer}>
            <View style={{ flexDirection: 'row', flex: 1, height: 24, alignItems: 'center' }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', flex: 1 }}
                onPress={() => setSelectedEducation(column.value)}>
                <BodyThree style={styles.rowTitle}>{column.label}</BodyThree>
              </TouchableOpacity>
            </View>
            {selectedEducation === column.value && <Icon name="done" color="white" />}
          </View>
          <Divider color={theme.colors.black2} style={styles.personalDivider} />
        </View>
      ))}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        <ButtonTypeTwo onPress={handlePatchAbout} title="保存" />
      </View>
    </View>
  );
}

export default EditProfileEducation;
