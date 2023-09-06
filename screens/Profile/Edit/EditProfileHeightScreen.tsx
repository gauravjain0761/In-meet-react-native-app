import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider, Icon, makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { BodyThree } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import { patchUserHeight, selectUserId, updateUser } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';
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
function EditProfileHeightScreen(props) {
  const { navigation } = props;
  useCustomHeader({ title: '居住地', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const cityMap = {
    '150以下': '150以下',
    '151-155': '151-155',
    '156-160': '156-160',
    '161-165': '161-165',
    '166-170': '166-170',
    '171-175': '171-175',
    '176-180': '176-180',
    '181-185': '181-185',
    '186-190': '186-190',
    '191-195': '191-195',
    '196-200': '196-200',
    '200以上': '200以上',
  };
  const cityArr = Object.entries(cityMap).map(([cityKey, cityValue]) => ({
    title: cityValue,
    value: cityKey,
  }));
  const height = useSelector((state: RootState) => state.user.height);

  const [localHeight, setLocalHeight] = useState(height || cityMap['150以下']);

  const userId = useSelector(selectUserId);
  const dispatch = useAppDispatch();

  const columns = [
    {
      title: '不透露',
      value: 'UNKNOWN',
    },
    ...cityArr,
  ];

  const handlePatchInterests = async () => {
    try {
      await dispatch(updateUser({ userId, height: localHeight })).unwrap();
      dispatch(patchUserHeight(localHeight));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {columns.map(column => (
          <View key={column.title}>
            <View style={styles.rowContainer}>
              <View style={{ flexDirection: 'row', flex: 1, height: 24, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setLocalHeight(column.value)}
                  style={{ flexDirection: 'row', flex: 1 }}>
                  <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
                </TouchableOpacity>
              </View>
              {localHeight === column.value && <Icon name="done" color="white" />}
            </View>
            <Divider color={theme.colors.black2} style={styles.personalDivider} />
          </View>
        ))}
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 16,
          }}>
          <ButtonTypeTwo onPress={handlePatchInterests} title="保存" />
        </View>
      </View>
    </ScrollView>
  );
}

export default EditProfileHeightScreen;
