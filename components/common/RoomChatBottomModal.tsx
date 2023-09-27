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
  onUserPress?: () => void;
  onBloackPress?: () => void;
  onPasswordPress?: () => void;
  onConfirm?: (value: any) => void;
  isVisible?: boolean;
  modalText?: string;
  buttonOneTitle?: string;
  data?: any;
}
export default function RoomChatBottomModal(props: ICommonModal) {
  //用CommonModalComponent out時如果會卡住就用這個
  const {
    onClose,
    isVisible,
    onConfirm,
    modalText = '選擇居住地區',
    buttonOneTitle = '確定',
    data,
    onUserPress,
    onBloackPress,
    onPasswordPress,
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
          <TouchableOpacity onPress={onUserPress} style={[styles.headerStyle,{marginTop:20}]}>
            {mapIcon.userIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"查看個人檔案"}</SubTitleTwo>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPasswordPress} style={styles.headerStyle}>
            {mapIcon.inEyeIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"隱藏對話讀"}</SubTitleTwo>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBloackPress} style={styles.headerStyle}>
            {mapIcon.blockIcon1({size:24})}
            <SubTitleTwo style={styles.titleText}>{"封鎖用戶"}</SubTitleTwo>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
}
