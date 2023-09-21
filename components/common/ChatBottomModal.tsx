import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from './Text';
import { ButtonTypeTwo, UnChosenButton } from './Button';
import { mapIcon } from '~/constants/IconsMapping';
import Picker from 'react-native-picker-select';
import { fontSize } from '~/helpers/Fonts';
import DynamicallySelectedPicker from './DynamicallySelectedPicker';
import InputField from './InputField';
import { Feather } from '@expo/vector-icons';
import { FormProvider } from 'react-hook-form';

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
    height:340
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
  },
  buttonStyle: {
    paddingTop: 10,
  },
  textStyle: {
    fontSize: fontSize(14),
  },
}));

interface ICommonModal {
  onClose?: () => void;
  onSubmitPress?: () => void;
  onConfirm: (value: any) => void;
  isVisible: boolean;
  modalText?: string;
  buttonOneTitle?: string;
  data?: any;
  methods?:any
  showPassword?:boolean
  opnePassword?:() => void;
  onSecondPress?:() => void;
}
export default function ChatBottomModal(props: ICommonModal) {
  //用CommonModalComponent out時如果會卡住就用這個
  const {
    onClose,
    isVisible,
    methods,
    onSubmitPress,
    showPassword,
    opnePassword,
    onSecondPress,
  } = props;
  const styles = useStyles();
  const [showEye, setShowEye] = useState<boolean>(false);

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
          {!showPassword ?<>
            <TouchableOpacity onPress={opnePassword} style={[styles.headerStyle,{marginTop:20}]}>
            {mapIcon.inEyeIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"隱藏對話（升級VIP可使用此功能）"}</SubTitleTwo>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSecondPress} style={styles.headerStyle}>
            {mapIcon.opneEmailIcon({size:20})}
            <SubTitleTwo style={styles.titleText}>{"全部標為已讀"}</SubTitleTwo>
          </TouchableOpacity>
          </>:
          <FormProvider {...methods}>
         <View style={{marginTop:30}}>
         
          <InputField
             name="password"
            keyboardType="default"
            secureTextEntry={!showEye}
            textContentType="password"
            placeholder="輸入密碼"
            label='輸入密碼查看隱藏對話'
            // onSubmit={handleSubmit(onSubmit)}
            rules={{
              required: "錯誤密碼提示",
            }}
            styles={{}}
            rightStyle={{top:"65%"}}
            onRightPress={() => setShowEye(!showEye)}
            containerStyle={{marginHorizontal:12}}
            right={
              showEye ? (
                <Feather name="eye" size={24} color="#A8ABBD" />
              ) : (
                mapIcon.invisiblePassword()
              )
            }
          />
          
          <ButtonTypeTwo
           containerStyle={[styles.buttonStyle, { marginBottom: 10, marginTop: 30 }]}
           buttonStyle={{ height: 50,marginHorizontal:12 }}
           titleStyle={styles.textStyle}
               
                title="確定"
                onPress={onSubmitPress}
              />
              <UnChosenButton
               titleStyle={styles.textStyle}
               buttonStyle={{ height: 50, backgroundColor: 'transparent' ,marginHorizontal:12}}
                title="取消"
                onPress={handleCloseModal}
              />
         </View>
              </FormProvider>
        }
       
        </View>
      </View>
    </ReactNativeModal>
  );
}
