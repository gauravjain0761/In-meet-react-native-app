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

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin:0
  },
  cardContainer: {
    backgroundColor: theme.colors?.black1,
    width: '100%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    paddingHorizontal: 24,
  },
  headerStyle:{
  flexDirection:'row',
  alignItems:'center'
  },
  titleText: {
    color: theme.colors?.white,
    paddingVertical: 20,
    textAlign: 'center',
    flex:1,
    marginRight:20
  },
  buttonStyle: {
    marginTop: 10,
    marginBottom:20
  },
  modalView:{
    borderRadius:10
  },
  valueText:{
    paddingHorizontal:140,
    paddingVertical:6,
    color:theme?.colors?.white,
    fontSize:fontSize(20),
    fontFamily:'roboto'
  }
}));

interface ICommonModal {
  onClose?: () => void;
  onConfirm: (value:any) => void;
  isVisible: boolean;
  modalText?: string;
  buttonOneTitle?: string,
  data?:any,
}
export default function CityModal(props: ICommonModal) {//用CommonModalComponent out時如果會卡住就用這個
  const {
    onClose,
    isVisible,
    onConfirm,
    modalText = '選擇居住地區',
    buttonOneTitle="確定",
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
    const vlaue =data.filter((item:any,index:number)=>{
      return index === selectedItemIndex
    })

    onConfirm(vlaue[0]);
  };


  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={10}
      backdropOpacity={0.5}
      animationOut={"fadeOutDown"}
      isVisible={isVisible}
      style={{margin:0}}
      >
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.headerStyle}>
           <TouchableOpacity onPress={handleCloseModal}>
            {mapIcon.closeIcon({size:24})}
           </TouchableOpacity>
          <SubTitleTwo style={styles.titleText}>{modalText}</SubTitleTwo>
          </View>
          <View style={{alignItems:'center',height:300}}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> 
              {data.map((item:any)=>{
                return <TouchableOpacity onPress={()=>setSelectValue(item)} style={[styles.modalView,{backgroundColor: item.label == selectValue.label ?  "#4A4D5A" :"transparent"}]}>
                  <Text style={styles.valueText}>{item.label}</Text>
                </TouchableOpacity>
              })}
            </ScrollView> */}

          <DynamicallySelectedPicker
              items={data}
              onScroll={({ index }) => setSelectedItemIndex(index)}
              onMomentumScrollBegin={({ index }) => setSelectedItemIndex(index)}
              onMomentumScrollEnd={({ index }) => setSelectedItemIndex(index)}
              onScrollBeginDrag={({ index }) => setSelectedItemIndex(index)}
              onScrollEndDrag={({ index }) => setSelectedItemIndex(index)}
              initialSelectedIndex={selectedItemIndex}
              height={height}
              width={windowWidth}
            />
          </View>
          <ButtonTypeTwo containerStyle={styles.buttonStyle} title={buttonOneTitle} onPress={handleConfirmModal} />
        </View> 
      </View>
    </ReactNativeModal>
  );
}

