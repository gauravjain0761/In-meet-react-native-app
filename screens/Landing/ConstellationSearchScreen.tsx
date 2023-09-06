import { View, Text, useWindowDimensions } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { ConstellationSearchScreenProps } from '../../navigation/LandingNavigator';
import { BodyThree, TitleOne } from '../../components/common/Text';
import { ButtonTypeTwo } from '../../components/common/Button';
import { mapIcon } from '~/constants/IconsMapping';
import { RootState } from '~/store';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  bannerText: {
    color: theme.colors?.white,
    textAlign: 'center',
    paddingTop: 40,
  },
  titleText: {
    color: theme.colors?.white,
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  footerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 40,
  },

  dropdownPlaceholderText: {
    color: theme.colors?.black4,
    fontSize: 14,
    fontWeight: '400',
  },
  dropdownContainer: {
    paddingHorizontal: 40,
  },
  dropdownStyle: {
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.black2,
    borderWidth: 0,
  },
  dropdownTextStyle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
  },
  dropdownItemTextStyle: {
    textAlign: 'center',
    color: theme.colors?.black4,
    fontSize: 14,
    fontWeight: '400',
  },
  dropdownSelectedItemStyle: {
    textAlign: 'center',
    color: theme.colors?.white,
    fontSize: 14,
    fontWeight: '400',
  },
  dropdownItemContainerStyle: {
    backgroundColor: theme.colors?.black2,
    borderWidth: 0,
    borderRadius: 20,
    marginHorizontal: 40,
    marginTop: 10,
  },
  arrowIconStyle: {
    tintColor: 'white',
  },
}));

export default function ConstellationSearchScreen(props: ConstellationSearchScreenProps) {
  const { navigation } = props;
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const styles = useStyles();
  const constellation = useSelector((state: RootState) => state.user.constellation);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: '金牛座', value: '金牛座' },
    { label: '水瓶座', value: '水瓶座' },
    { label: '牡羊座', value: '牡羊座' },
    { label: '雙子座', value: '雙子座' },
    { label: '巨蟹座', value: '巨蟹座' },
    { label: '獅子座', value: '獅子座' },
    { label: '處女座', value: '處女座' },
    { label: '天秤座', value: '天秤座' },
    { label: '天蠍座', value: '天蠍座' },
    { label: '射手座', value: '射手座' },
    { label: '摩羯座', value: '摩羯座' },
    { label: '雙魚座', value: '雙魚座' },
  ]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return <BodyThree style={styles.headerTitle}>星座配對</BodyThree>;
      },
    });
  });

  const handlePressSearch = () => {
    navigation.navigate('ConstellationResultScreen', {
      constellation: value || '',
    });
  };

  return (
    <View style={{ backgroundColor: theme.colors.black1, flex: 1 }}>
      <TitleOne style={styles.bannerText}>我是 {constellation}</TitleOne>
      <TitleOne style={styles.titleText}>我想要尋找</TitleOne>

      {/* dropdown */}

      <DropDownPicker
        open={open}
        value={value}
        placeholder="選擇星座"
        placeholderStyle={styles.dropdownPlaceholderText}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        disableBorderRadius={false}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdownStyle}
        textStyle={styles.dropdownTextStyle}
        listItemLabelStyle={styles.dropdownItemTextStyle}
        selectedItemLabelStyle={styles.dropdownSelectedItemStyle}
        showTickIcon={false}
        dropDownContainerStyle={styles.dropdownItemContainerStyle}
        maxHeight={200}
        arrowIconStyle={styles.arrowIconStyle}
      />

      <View style={styles.footerContainer}>
        <ButtonTypeTwo title="搜尋" onPress={handlePressSearch} />
      </View>
    </View>
  );
}
