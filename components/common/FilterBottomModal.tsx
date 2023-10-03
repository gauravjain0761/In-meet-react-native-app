import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { BodyThree, SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import { mapIcon } from '~/constants/IconsMapping';
import Picker from 'react-native-picker-select';
import { fontSize } from '~/helpers/Fonts';
import DynamicallySelectedPicker from './DynamicallySelectedPicker';
import matchBg from '../../assets/images/icons/matchBg.png';
import { selectCityData } from '~/constants/mappingValue';

const height = Dimensions.get('window').height;
const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    margin: 0,
  },
  cardContainer: {
    backgroundColor: theme.colors?.black1,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    height: height * 0.75,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: theme.colors?.white,
    paddingVertical: 14,
    textAlign: 'center',
    marginLeft: 20,
    fontSize: fontSize(16),
  },
  closeStyle: {
    alignSelf: 'flex-end',
    marginRight: 24,
    marginBottom: 10,
    width: 34,
    height: 34,
    backgroundColor: theme.colors.black2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34 / 2,
  },
  diviedStyle: {
    width: 12,
    height: 3,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    alignSelf: 'center',
    marginTop: 10,
  },
}));

interface ICommonModal {
  onClose?: () => void;
  onSelectBtns?: () => void;
  onConfirm?: (value: any) => void;
  isVisible?: boolean;
  modalText?: string;
  buttonOneTitle?: string;
  data?: any;
  selectCity?: any;
  setSelectCity: any;
}
export default function FilterBottomModal(props: ICommonModal) {
  //用CommonModalComponent out時如果會卡住就用這個
  const { onClose, isVisible, data, onSelectBtns, selectCity, setSelectCity } = props;
  const styles = useStyles();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(4);
  const windowWidth = Dimensions.get('window').width;
  const height = 300;
  const { theme } = useTheme();
  const [selectCityList, setSelectCityList] = useState(selectCityData);
  const [allCity, setAllCity] = useState(false);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSelectPress = (item: any) => {
    const updateData = selectCityList.map((list: any) => {
      if (item.id === list.id) {
        return {
          ...list,
          isSelect: !item.isSelect,
        };
      } else {
        return {
          ...list,
        };
      }
    });
    setSelectCityList(updateData);
  };

  const onConfirmPress = () => {
    const filterData = selectCityList.filter((item) => item.isSelect === true);
    setSelectCity(filterData);
    onClose();
  };
  const onSelectAllCityPress = () => {
    const filterData = selectCityList.map((item) => {return {...item, isSelect: !allCity}});
    setSelectCityList(filterData);
    setAllCity(!allCity)
  };

  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={10}
      backdropOpacity={0.5}
      animationOut={'fadeOutDown'}
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.90)"
      style={{ margin: 0 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleCloseModal} style={styles.closeStyle}>
          {mapIcon.closeIcon({ size: 22, color: '#fff' })}
        </TouchableOpacity>
        <View style={styles.cardContainer}>
          <View style={styles.diviedStyle} />
          <ScrollView style={{ marginBottom: 80 }}>
            <BodyThree
              style={{
                color: theme.colors.white,
                marginVertical: 12,
              }}>
              {'已選城市'}
            </BodyThree>
            <TouchableOpacity
                  onPress={() => onSelectAllCityPress()}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  {allCity ? (
                    mapIcon.checkIcon({ size: 19 })
                  ) : (
                    <View
                      style={{
                        width: 19,
                        height: 19,
                        borderRadius: 19,
                        borderWidth: 0.5,
                        borderColor: theme.colors.black4,
                      }}
                    />
                  )}
                  <BodyThree
                    style={{
                      color: theme.colors.white,
                      marginLeft: 10,
                    }}>
                    {"全部城市"}
                  </BodyThree>
                </TouchableOpacity>
            {selectCityList.map((item: any) => {
              return (
                <TouchableOpacity
                  onPress={() => onSelectPress(item)}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  {item?.isSelect ? (
                    mapIcon.checkIcon({ size: 19 })
                  ) : (
                    <View
                      style={{
                        width: 19,
                        height: 19,
                        borderRadius: 19,
                        borderWidth: 0.5,
                        borderColor: theme.colors.black4,
                      }}
                    />
                  )}
                  <BodyThree
                    style={{
                      color: theme.colors.white,
                      marginLeft: 10,
                    }}>
                    {item?.name}
                  </BodyThree>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <ImageBackground
          source={matchBg}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 80,
            paddingBottom: 60,
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
          }}>
          <ButtonTypeTwo
            containerStyle={[
              // styles.buttonStyle,
              { marginBottom: 10, marginTop: 10, marginHorizontal: 50 },
            ]}
            buttonStyle={{ height: 48 }}
            // titleStyle={styles.textStyle}
            title="儲存"
            onPress={onConfirmPress}
          />
        </ImageBackground>
      </View>
    </ReactNativeModal>
  );
}
