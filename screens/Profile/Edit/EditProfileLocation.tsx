import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Divider, Icon, makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import { BodyThree } from '~/components/common/Text';
import useCustomHeader from '~/hooks/useCustomHeader';
import { RootState, useAppDispatch } from '~/store';
import { CITYEnum } from '~/constants/mappingValue';
import { ButtonTypeTwo } from '~/components/common/Button';
import { patchUserCity, selectUserId, updateUser } from '~/store/userSlice';

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
function EditProfileLocation(props) {
  const { navigation } = props;
  useCustomHeader({ title: '居住地', navigation });
  const city = useSelector((state: RootState) => state.user.city);

  const { theme } = useTheme();
  const styles = useStyles();
  const cityMap = {
    KLU: '基隆市',
    TPE: '台北市',
    TPH: '新北市',
    TYC: '桃園市',
    HSC: '新竹市',
    HSH: '新竹縣',
    MAL: '苗栗縣',
    TXG: '台中市',
    CWH: '彰化縣',
    NTO: '南投縣',
    YLH: '雲林縣',
    CYI: '嘉義市',
    CHI: '嘉義縣',
    TNN: '台南市',
    KHH: '高雄市',
    IUH: '屏東縣',
    TTT: '台東縣',
    HWC: '花蓮市',
    ILN: '宜蘭縣',
    PEH: '澎湖縣',
    KMN: '金門縣',
    LNN: '連江縣',
  };
  const cityArr = Object.entries(cityMap).map(([cityKey, cityValue]) => ({
    title: cityValue,
    value: cityKey,
  }));
  const userId = useSelector(selectUserId);

  const dispatch = useAppDispatch();
  const [localCity, setLocalCity] = useState(city || '');

  const columns = [
    {
      title: '不透露',
      value: 'UNKNOWN',
    },
    ...cityArr,
  ];
  const handlePatchInterests = async () => {
    try {
      await dispatch(updateUser({ userId, city: localCity })).unwrap();
      dispatch(patchUserCity(localCity));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black1, paddingBottom: 20 }}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        <View style={{ flex: 1, paddingBottom: 20 }}>
          {columns.map(column => (
            <View key={column.title}>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => setLocalCity(column.value)}
                  style={{ flexDirection: 'row', flex: 1, alignItems: 'center', height: 24 }}>
                  <BodyThree style={styles.rowTitle}>{column.title}</BodyThree>
                </TouchableOpacity>

                {localCity === column.value && <Icon name="done" color="white" />}
              </View>
              <Divider color={theme.colors.black2} style={styles.personalDivider} />
            </View>
          ))}
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <ButtonTypeTwo onPress={handlePatchInterests} title="保存" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditProfileLocation;
