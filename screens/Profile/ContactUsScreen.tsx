import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { mapIcon } from '../../constants/IconsMapping';
import { BodyOne, BodyThree, BodyTwo, CaptionFour } from '../../components/common/Text';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { useHeaderHeight } from '@react-navigation/elements';
import { FormProvider, useForm } from 'react-hook-form';
import InputField from '~/components/common/InputField';
import { TextInput } from 'react-native';
import { fontSize } from '~/helpers/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonTypeTwo } from '~/components/common/Button';
import { FlatList } from 'react-native';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  footerContainer: {
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: theme.colors.black2,
    paddingHorizontal: 12,
  },
  logoStyle: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.black4,
    backgroundColor: theme.colors.black,
    marginRight: 10,
  },
  text: {
    color: theme.colors?.white,
    // paddingHorizontal: 16,
  },
  inputStyle: {
    color: theme.colors.white,
    fontSize: fontSize(14),
    fontWeight: '300',
    fontFamily: 'roboto',
    maxHeight: 100,
    minHeight: 150,
    backgroundColor: theme.colors.black2,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    textAlignVertical: 'top',
    marginTop: 10,
  },
}));

export default function ContactUsScreen(props: ProfileStackScreenProps<'ContactUsScreen'>) {
  const { theme } = useTheme();
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const methods = useForm();
  const { navigation } = props;
  const [inputValue, setInputValue] = useState('');
  const [bodyText, setBodyText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '聯絡我們',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });

  const onClickCopy = () => {
    Clipboard.setString('support@inmeet.app');
    Toast.show('已複製support@inmeet.app');
  };
  return (
    <FormProvider {...methods}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.black1, marginTop: 80 }}>
        <View style={[styles.footerContainer, { flexDirection: 'row' }]}>
          <View style={styles.logoStyle}>{mapIcon.logoIcon({})}</View>
          <View style={{ flex: 1 }}>
            <BodyTwo style={{ color: theme.colors.white }}>InMeet小幫手</BodyTwo>
            <CaptionFour style={{ color: theme.colors.white }}>
              Hi，親愛的，是否在使用上遇到了什麼樣的問題或困難呢？請在表單中提供詳細的相關訊息、截圖、照片，我們客服人員收到後會第一時間回覆您的，謝謝您的使用！
            </CaptionFour>
          </View>
        </View>
        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
          <BodyThree style={[styles.text]}>
            <Text style={{ color: theme.colors.pink }}>{'* '}</Text>主題
          </BodyThree>
          <InputField
            name="name"
            required
            placeholder="輸入主題"
            textContentType="none"
            rules={{
              required: '輸入主題',
            }}
            value={bodyText}
            onChangeText={(text)=>setBodyText(text)}
            styles={{ marginTop: 8,borderRadius:14 }}
            containerStyle={{ paddingBottom: 24 }}
          />
          <BodyThree style={[styles.text]}>
            <Text style={{ color: theme.colors.pink }}>{'* '}</Text>問題與建議
          </BodyThree>
          <TextInput
            keyboardAppearance="dark"
            placeholder="輸入聊天內容"
            placeholderTextColor={theme.colors.black4}
            style={styles.inputStyle}
            returnKeyType="send"
            value={inputValue}
            onChangeText={setInputValue}
            multiline
          />
          <BodyThree style={[styles.text, { marginTop: 20 }]}>
            <Text style={{ color: theme.colors.pink }}>{'* '}</Text>電子郵件
          </BodyThree>
          <InputField
            name="name"
            required
            placeholder="輸入您的電子郵件"
            textContentType="none"
            rules={{
              required: '輸入您的電子郵件',
            }}
            styles={{ marginTop: 8,borderRadius:14 }}
            containerStyle={{ paddingBottom: 24 }}
          />
          <BodyThree style={[styles.text, { marginTop: 20 }]}>
            <Text style={{ color: theme.colors.pink }}>{'* '}</Text>聯絡電話
          </BodyThree>
          <InputField
            name="name"
            required
            placeholder="輸入您的聯絡電話"
            textContentType="none"
            rules={{
              required: '輸入您的聯絡電話',
            }}
            styles={{ marginTop: 8,borderRadius:14 }}
            containerStyle={{ paddingBottom: 24 }}
          />
          <BodyThree style={[styles.text, { marginTop: 20, color: theme.colors.black3 }]}>
            <Text style={{ color: theme.colors.white }}>{'檔案 '}</Text>上限5個檔案
          </BodyThree>
          <FlatList
            data={[0, 1, 2, 3,4,5,6]}
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={() => {
              return (
                <TouchableOpacity
                  // key={index}
                  // onPress={handleOnPressAddImage}
                  style={{
                    width: 74,
                    height:74,
                    backgroundColor: theme.colors.black2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 12,
                    marginRight: 14,
                    marginBottom: 6,
                    marginTop:10
                  }}>
                  {mapIcon.addIcon({ color: theme.colors.white, size: 34 })}
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <ButtonTypeTwo
          disabled={bodyText == '' ? true : false}
          disabledStyle={{ backgroundColor: 'rgba(255, 78, 132, 0.5)' }}
          disabledTitleStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          // onPress={handlePressPost}
          containerStyle={{ paddingHorizontal: 40, paddingVertical: 20 }}
          title="提交"
        />
      </ScrollView>
    </FormProvider>
  );
}
