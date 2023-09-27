import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image
} from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import { makeStyles, useTheme } from '@rneui/themed';
import { Slider } from '@miblanchard/react-native-slider';
import { Button, Divider } from '@rneui/base';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { BodyThree, CaptionFour } from '../../components/common/Text';
import {
  ButtonTypeOne,
  ButtonTypeTwo,
  ChosenButton,
  UnChosenButton,
} from '../../components/common/Button';
import { FilterScreenProps } from '../../navigation/LandingNavigator';
import { RootState, useAppDispatch } from '~/store';
import {
  selectToken,
  setFilterDistance,
  setFilterEndAge,
  setFilterHobbyIds,
  setFilterInterested,
  setFilterStartAge,
} from '~/store/userSlice';
import { interestApi } from '~/api/UserAPI';
import { mapIcon } from '~/constants/IconsMapping';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontSize } from '~/helpers/Fonts';
import matchBg from '../../assets/images/icons/matchBg.png';
import RoomChatBottomModal from '~/components/common/RoomChatBottomModal';
import FilterBottomModal from '~/components/common/FilterBottomModal';
import { updateCurrentId } from '~/store/forumSlice';

const { width,height } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  cardContainer: {
    height: 250,
    width: (width - 32 - 10) / 2,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: theme.colors.black2,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: (width - 32 - 10) / 2,
    height: 167,
  },
  textStyle: {
    marginTop: 8,
    color: theme.colors.white,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textfavorite: {
    color: theme.colors.white,
    marginLeft: 5,
  },
}));

enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL',
}

const defaultValue = {
  ageRange: [20, 30],
  distance: 0,
  interested: GENDER.ALL,
  selectedInterested: [],
};
export default function MyUpdateScreenz(props: FilterScreenProps) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [visibleModal, setVisibleModal] = React.useState(false);

  const user = useSelector((state: RootState) => state.user);
  const { distance: rootDistance, interested: rootInterested, startAge, endAge, hobbyIds } = user;

  const ageRangeSlideRef = useRef();
  const [ageRange, setAgeRange] = useState([startAge, endAge]);
  const [distance, setDistance] = useState(rootDistance);
  const [interested, setInterested] = useState(rootInterested);
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const { data } = useQuery('fetchUserByInterest', () =>
    interestApi.fetchAllInterest({ token, hobbyName: '', limit: 100 }, {})
  );
  const interestLists = data?.records;

  const [localSelectedInterests, setLocalSelectedInterests] = useState(hobbyIds);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '我的動態',
      headerLeft: (props) => (
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
      ),
    });
  });

  const setRootInterested = (value: string) => {
    dispatch(setFilterInterested(value));
  };
  const setRootDistance = (value: number) => {
    dispatch(setFilterDistance(value));
  };
  const setHobbys = (value: number[]) => {
    dispatch(setFilterHobbyIds(value));
  };
  const setAge = (value: number[]) => {
    dispatch(setFilterStartAge(value[0]));
    dispatch(setFilterEndAge(value[1]));
  };

  const handlePressSearch = () => {
    setRootInterested(interested);
    setRootDistance(distance);
    setHobbys(localSelectedInterests);
    setAge(ageRange);
    navigation.goBack();
  };
  const handlePressClear = () => {
    setInterested(defaultValue.interested);
    setDistance(defaultValue.distance);
    setLocalSelectedInterests(defaultValue.selectedInterested);
    setAgeRange(defaultValue.ageRange);
    defaultValue.ageRange.forEach((ageValue, index) => {
      ageRangeSlideRef.current._setCurrentValue(ageValue, index);
    });
  };
  const handleSelectInterest = (record: IInterest) => {
    setLocalSelectedInterests((prev) => [...prev, record]);
  };

  const handleRemoveSelectedInterest = (id) => {
    setLocalSelectedInterests((prev) => prev.filter((item) => item !== id));
  };

  const renderButton = (isChosen: boolean, title: string, onPress: () => void) => {
    if (isChosen) {
      return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 19,
              height: 19,
              borderRadius: 19,
              backgroundColor: theme.colors.pink,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
          <BodyThree
            style={{
              color: theme.colors.white,
              marginLeft: 10,
            }}>
            {title}
          </BodyThree>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 19,
            height: 19,
            borderRadius: 19,
            borderWidth: 0.5,
            borderColor: theme.colors.black4,
          }}
        />
        <BodyThree
          style={{
            color: theme.colors.white,
            marginLeft: 10,
          }}>
          {title}
        </BodyThree>
      </TouchableOpacity>
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={{ alignItems: 'center', top:height*0.3 }}>
        {mapIcon.tabViewBgIcon({ size: 100 })}
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: fontSize(16),
            lineHeight: 25,
            fontFamily: 'roboto',
            marginTop:20
          }}>
          {'尚未發布任何動態'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.colors.black1, flex: 1, marginTop: headerHeight - 25 }}>
      <FlatList
         data={[0, 1, 2,3,4,5]}
        // data={[]}
        style={{flex:1}}
        contentContainerStyle={{flex:1}}
        numColumns={2}
        columnWrapperStyle={styles.cardWrapper}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={() => {
          return (
            <TouchableOpacity onPress={()=>{
              dispatch(updateCurrentId(62));
              navigation.push('ForumDetailScreen');
            }} style={styles.cardContainer}>
              <Image
                source={{ uri: 'https://picsum.photos/id/231/200/300' }}
                resizeMode="cover"
                style={styles.imageStyle}
              />
              <CaptionFour style={styles.textStyle}>
                {'路跑美乞條追，斤升支杯語帶左蛋戶包呀送「那像請...'}
              </CaptionFour>
              <View style={[styles.footerCard, { alignSelf: 'center', marginTop: 8 }]}>
                <TouchableOpacity style={[styles.footerCard, { marginRight: 20 }]}>
                  {mapIcon.favoriteIcon({ size: 20 })}
                  <BodyThree style={styles.textfavorite}>1290</BodyThree>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerCard}>
                  {mapIcon.commentIcon({ size: 20 })}
                  <BodyThree style={styles.textfavorite}>0</BodyThree>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
