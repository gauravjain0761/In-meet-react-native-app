import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider, Icon, makeStyles, useTheme } from '@rneui/themed';
import Toast from 'react-native-root-toast';
import { useSelector } from 'react-redux';
import { BodyThree } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import { patchUserBloodType, updateUser } from '~/store/userSlice';
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
function EditProfileBloodScreen(props) {
  const { navigation } = props;
  useCustomHeader({ title: '血型', navigation });
  const { theme } = useTheme();
  const styles = useStyles();
  const cityMap = {
    A: 'A型',
    B: 'B型',
    O: 'O型',
    AB: 'AB型'
  };
  const cityArr = Object.entries(cityMap).map(([cityKey, cityValue]) => ({
    title: cityValue,
    value: cityKey,
  }));
  const { id: userId, bloodType: bloodTypeStore } = useSelector((state: RootState) => state.user);
  const [bloodType, setBloodType] = useState(bloodTypeStore || '');
  const dispatch = useAppDispatch();
  const handlePatchInterests = async () => {
    try {
      await dispatch(updateUser({ userId, bloodType })).unwrap();
      dispatch(patchUserBloodType(bloodType));
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
    ...cityArr,
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {columns.map(column => (
          <View key={column.title}>
            <View style={styles.rowContainer}>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', height: 24 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', flex: 1 }}
                  onPress={() => setBloodType(column.value)}>
                  <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
                </TouchableOpacity>
              </View>
              {column.value === bloodType && <Icon name="done" color="white" />}
            </View>
            <Divider color={theme.colors.black2} style={styles.personalDivider} />
          </View>
        ))}
        <ButtonTypeTwo
          style={{ paddingTop: 20, paddingHorizontal: 16 }}
          onPress={handlePatchInterests}
          title="保存"
        />
      </View>
    </ScrollView>
  );
}

export default EditProfileBloodScreen;
