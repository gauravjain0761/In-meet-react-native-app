import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider, Icon, makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { BodyThree } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import { RootState, useAppDispatch } from '~/store';
import { patchUserReligion, selectUserId, updateUser } from '~/store/userSlice';
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
function EditProfileReligionScreen(props) {
  const { navigation } = props;
  useCustomHeader({ title: '宗教', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const religion = useSelector((state: RootState) => state.user.religion);

  const [localReligion, setLocalReligion] = useState(religion || '');

  const userId = useSelector(selectUserId);
  const dispatch = useAppDispatch();

  const handlePatchInterests = async () => {
    try {
      await dispatch(updateUser({ userId, religion: localReligion })).unwrap();
      dispatch(patchUserReligion(localReligion));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  const columns = [
    {
      title: '不透露',
      value: 'UNKNOWN',
    },
    {
      title: '道教',
      value: 'TAOISM',
    },
    {
      title: '佛教',
      value: 'BUDDHISM',
    },
    {
      title: '天主教',
      value: 'CATHOLIC',
    },
    {
      title: '基督教',
      value: 'CHRISTIANITY',
    },
    {
      title: '回教',
      value: 'ISLAM',
    },
    {
      title: '印度教',
      value: 'HINDUISM',
    },
    {
      title: '穆斯林',
      value: 'MUSLIM',
    },
    {
      title: '猶太教',
      value: 'JUDAISM',
    },
    {
      title: '其他宗教',
      value: 'OTHER',
    },
    {
      title: '沒有宗教',
      value: 'NONE',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      {columns.map(column => (
        <View key={column.title}>
          <View style={styles.rowContainer}>
            <View style={{ flexDirection: 'row', flex: 1, height: 24, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setLocalReligion(column.value)}
                style={{ flexDirection: 'row', flex: 1 }}>
                <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
              </TouchableOpacity>
            </View>
            {localReligion === column.value && <Icon name="done" color="white" />}
          </View>
          <Divider color={theme.colors.black2} style={styles.personalDivider} />
        </View>
      ))}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 20,
        }}>
        <ButtonTypeTwo onPress={handlePatchInterests} title="保存" />
      </View>
    </View>
  );
}

export default EditProfileReligionScreen;
