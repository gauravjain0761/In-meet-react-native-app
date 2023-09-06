import { View, Text, Image, Modal, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import {
  BodyThree,
  CaptionFive,
  CaptionFour,
  SubTitleOne,
  SubTitleTwo,
  TitleOne,
} from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import { ButtonTypeTwo, UnChosenButton } from '../../components/common/Button';
import ProfileRowItem from '../../components/Profile/ProfileRowItem';
import ProfileBodyColumn from '../../components/Profile/ProfileBodyColumn';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import { getUserInfo } from '../../store/userSlice';
import { RootState, useAppDispatch } from '../../store';
import { UN_KNOWN } from '~/constants/defaultValue';
import CommonModalComponent from '~/components/common/CommonModalComponent';
import { calculateExpiredDate } from '~/helpers/convertDate';

const { width, height: WindowHeight } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.black1,
  },
  headerInfoContainer: {
    alignSelf: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: theme.colors?.white,
    borderRadius: 120,
  },
  bodyContainer: {
    paddingTop: 10,
    width: 160,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    paddingTop: 20,
  },

  title: {
    color: theme.colors?.pink,
    flex: 1,
  },
  defaultTitle: {
    color: theme.colors?.white,
    flex: 1,
  },
  centeredView: {
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 25,
    paddingBottom: 16,
  },

  modalSubtitle: {
    paddingVertical: 20,
    textAlign: 'center',
    flexGrow: 1,
    color: theme.colors?.black3,
  },

  likeCount: {
    color: theme.colors?.black3,
    paddingLeft: 12,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  description: {
    color: theme.colors?.black4,
    flex: 1,
  },
}));

export default function ProfileLandingScreen(
  props: ProfileStackScreenProps<'ProfileLandingScreen'>,
) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { name, signature, point, starAmount, height, job, education, hobbies, about, vipEndTime } =
    useSelector((state: RootState) => state.user);

  const dataRow = [
    {
      title: '加入VIP',
      titleStyle: styles.title,
      rightIcon: mapIcon.diamondIcon(),
      description: calculateExpiredDate(vipEndTime),
      descriptionStyle: styles.description,
      onPress: () => {
        navigation.push('PurchaseVIPScreen');
      },
    },
    {
      title: '個人資料',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.personalIcon(),
      onPress: () => {
        // ProfileDetail is at root
        navigation.push('ProfileDetail');
      },
    },
    {
      title: '設定',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.settingIcon(),
      onPress: () => {
        navigation.push('ProfileSettingScreen');
      },
    },
    {
      title: '幫助',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.inquiryIcon(),
      onPress: () => {
        navigation.push('ProfileHelpScreen');
      },
    },
    {
      title: '聯絡我們',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.contactIcon(),
      onPress: () => {
        navigation.push('ContactUsScreen');
      },
    },
    {
      title: '即時客服聊天室',
      titleStyle: styles.defaultTitle,
      rightIcon: mapIcon.chatIcon(),
      onPress: () => {
        navigation.push('HelperRoomChatScreen');
      },
    },
  ];
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserInfo({}));
    }, []),
  );

  const [modalVisible, setModalVisible] = useState(false);
  useFocusEffect(() => {
    if (!about || !height || !job || !education || !hobbies || isEmpty(hobbies)) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <ProfileHeader headerStyle={{ paddingTop: 40 }} />

        <View style={styles.bodyContainer}>
          <ProfileBodyColumn
            buttonText="查看"
            onPress={() => {
              navigation.push('CollectionScreen');
            }}
            icon={mapIcon.starIcon({ color: theme.colors.yellow, size: 15 })}
            count={starAmount}
            title="誰收藏我"
          />
          <ProfileBodyColumn
            buttonText="追加"
            icon={mapIcon.likeIcon({ color: theme.colors.pink, size: 15 })}
            count={point}
            onPress={() => {
              navigation.push('PurchaseHeart');
            }}
            title="剩餘的愛心"
          />
        </View>
        {modalVisible && (
          <View
            style={{
              width: '100%',
            }}>
            <View style={styles.modalWrapper}>
              <View style={styles.centeredView}>
                <BodyThree style={styles.modalSubtitle}>
                  充足您的個人資訊，填寫身高、職業、學歷、與興趣、自我介紹，完成即可獲得15顆愛心！
                </BodyThree>
                <ButtonTypeTwo
                  onPress={() => {
                    setModalVisible(false);
                    navigation.push('ProfileDetail');
                  }}
                  buttonStyle={{
                    paddingHorizontal: 32,
                  }}
                  style={{
                    alignSelf: 'center',
                  }}
                  title="開始填寫"
                />
              </View>
            </View>
          </View>
        )}
        <View style={styles.footerContainer}>
          {dataRow.map(item => (
            <ProfileRowItem
              key={item.title}
              title={item.title}
              titleStyle={item.titleStyle}
              rightIcon={item.rightIcon}
              onPress={item.onPress}
              description={item.description}
              descriptionStyle={item.descriptionStyle}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
