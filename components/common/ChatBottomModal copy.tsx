import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import { mapIcon } from '~/constants/IconsMapping';
import Picker from 'react-native-picker-select';
import { fontSize } from '~/helpers/Fonts';
import DynamicallySelectedPicker from './DynamicallySelectedPicker';

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
    height:300
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
    fontSize:fontSize(16)
  },
  closeStyle: {
    alignSelf: 'flex-end',
    marginRight: 24,
    marginBottom: 10,
    width: 34,
    height: 34,
    backgroundColor: theme.colors.black2,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:34/2
  },
  diviedStyle:{
    width:12,
    height:3,
    borderRadius:8,
    backgroundColor:theme.colors.white,
    alignSelf:'center',
    marginTop:10
  }
}));

interface ICommonModal {
  onClose?: () => void;
  onConfirm: (value: any) => void;
  isVisible: boolean;
  modalText?: string;
  buttonOneTitle?: string;
  data?: any;
}
export default function ChatBottomModal(props: ICommonModal) {
  //用CommonModalComponent out時如果會卡住就用這個
  const {
    onClose,
    isVisible,
    onConfirm,
    modalText = '選擇居住地區',
    buttonOneTitle = '確定',
    data,
  } = props;
  const styles = useStyles();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(4);
  const windowWidth = Dimensions.get('window').width;
  const height = 300;

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleConfirmModal = () => {
    const vlaue = data.filter((item: any, index: number) => {
      return index === selectedItemIndex;
    });

    onConfirm(vlaue[0]);
  };

  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={10}
      backdropOpacity={0.5}
      animationOut={'fadeOutDown'}
      isVisible={isVisible}
      backdropColor='rgba(0, 0, 0, 0.90)'
      style={{ margin: 0 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleCloseModal} style={styles.closeStyle}>
          {mapIcon.closeIcon({ size: 22,color:"#fff" })}
        </TouchableOpacity>
        <View style={styles.cardContainer}>
          <View style={styles.diviedStyle}/>
          <View style={[styles.headerStyle,{marginTop:20}]}>
            {mapIcon.inEyeIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"隱藏對話（升級VIP可使用此功能）"}</SubTitleTwo>
          </View>
          <View style={styles.headerStyle}>
            {mapIcon.opneEmailIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"全部標為已讀"}</SubTitleTwo>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
}
