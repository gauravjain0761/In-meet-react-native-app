import { View, Text, Dimensions, ScrollView } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
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

const { width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  interestChipContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  interestButtonContainer: {
    paddingHorizontal: 7,
    paddingBottom: 8,
  },
  interestButton: { height: 22, width:60, padding :0 },
  interestButtonTitle: {
    color: theme.colors?.black4,
  },
  filterTitle: {
    color: theme.colors?.black4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  thumbStyle: {
    borderWidth: 3,
    width: 22,
    height: 22,
    borderRadius: 22,
    borderColor: theme.colors?.white,
    backgroundColor: theme.colors?.pink,
  },
  sliderContainer: { paddingHorizontal: 16 },
  buttonContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20 },
  chosenButtonText: {
    color: theme.colors.white,
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
export default function FilterScreen(props: FilterScreenProps) {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = useStyles();

  const user = useSelector((state: RootState) => state.user);
  const { distance: rootDistance, interested: rootInterested, startAge, endAge, hobbyIds } = user;

  const ageRangeSlideRef = useRef();
  const [ageRange, setAgeRange] = useState([startAge, endAge]);
  const [distance, setDistance] = useState(rootDistance);
  const [interested, setInterested] = useState(rootInterested);
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const { data } = useQuery('fetchUserByInterest', () =>
    interestApi.fetchAllInterest({ token, hobbyName: '', limit: 100 }, {}),
  );
  const interestLists = data?.records;

  const [localSelectedInterests, setLocalSelectedInterests] = useState(hobbyIds);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,

      headerTitle: props => {
        return <BodyThree style={styles.headerTitle}>篩選</BodyThree>;
      },
      headerShown: true,
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
    setLocalSelectedInterests(prev => [...prev, record]);
  };

  const handleRemoveSelectedInterest = id => {
    setLocalSelectedInterests(prev => prev.filter(item => item !== id));
  };

  const renderButton = (isChosen: boolean, title: string, onPress: () => void) => {
    if (isChosen) {
      return (
        <ChosenButton
          buttonStyle={{}}
          onPress={onPress}
          title={
            <BodyThree
              style={{
                color: theme.colors.pink,
              }}>
              {title}
            </BodyThree>
          }
        />
      );
    }
    return (
      <UnChosenButton
        onPress={onPress}
        buttonStyle={{}}
        title={
          <BodyThree
            style={{
              color: theme.colors.black4,
            }}>
            {title}
          </BodyThree>
        }
      />
    );
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.black1, flex: 1 }}>
      <View style={styles.rowContainer}>
        <CaptionFour style={styles.filterTitle}>感興趣的</CaptionFour>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
          {renderButton(interested === GENDER.MALE, '男性', () => setInterested(GENDER.MALE))}
        </View>
        <View style={{ flex: 1, paddingHorizontal: 6 }}>
          {renderButton(interested === GENDER.FEMALE, '女性', () => setInterested(GENDER.FEMALE))}
        </View>
        <View style={{ flex: 1 }}>
          {renderButton(interested === GENDER.ALL, '不限', () => setInterested(GENDER.ALL))}
        </View>
      </View>
      <Divider width={2} color={theme.colors.black2} style={{ marginBottom: 20 }} />
      <View style={styles.rowContainer}>
        <CaptionFour style={styles.filterTitle}>距離範圍</CaptionFour>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: theme.colors.black2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}>
            <BodyThree
              style={{
                color: theme.colors.black4,
              }}>
              {distance}
            </BodyThree>
          </View>
          <BodyThree style={{ color: theme.colors.pink, paddingLeft: 4 }}>km</BodyThree>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          minimumTrackTintColor={theme.colors.pink}
          maximumTrackTintColor={theme.colors.black4}
          minimumValue={0}
          maximumValue={100}
          animateTransitions
          thumbStyle={styles.thumbStyle}
          trackStyle={{ backgroundColor: theme.colors.black4 }}
          value={distance}
          onValueChange={distance => {
            setDistance(parseInt(distance));
          }}
        />
      </View>
      <Divider width={2} color={theme.colors.black2} style={{ marginBottom: 20 }} />
      <View style={styles.rowContainer}>
        <CaptionFour style={styles.filterTitle}>年齡範圍</CaptionFour>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: theme.colors.black2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}>
            <BodyThree
              style={{
                color: theme.colors.black4,
              }}>
              {ageRange[0]}
            </BodyThree>
          </View>

          <BodyThree style={{ color: theme.colors.pink, paddingHorizontal: 4 }}>-</BodyThree>
          <View
            style={{
              backgroundColor: theme.colors.black2,
              paddingHorizontal: 10,
              paddingVertical: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
            }}>
            <BodyThree
              style={{
                color: theme.colors.black4,
              }}>
              {ageRange[1]}
            </BodyThree>
          </View>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          ref={ageRangeSlideRef}
          minimumTrackTintColor={theme.colors.pink}
          maximumTrackTintColor={theme.colors.black4}
          minimumValue={0}
          maximumValue={100}
          thumbStyle={styles.thumbStyle}
          trackStyle={{ backgroundColor: theme.colors.black4 }}
          value={ageRange}
          animateTransitions
          step={2}
          onSlidingComplete={() => {}}
          onValueChange={value => {
            setAgeRange(value);
          }}
        />
      </View>
      <Divider width={2} color={theme.colors.black2} style={{ marginBottom: 20 }} />
      <View style={styles.rowContainer}>
        <CaptionFour style={styles.filterTitle}>興趣</CaptionFour>
      </View>

      <View style={styles.interestChipContainer}>
        {interestLists?.map((record, index) =>
          localSelectedInterests.includes(record.id) ? (
            <ButtonTypeTwo
              containerStyle={styles.interestButtonContainer}
              buttonStyle={styles.interestButton}
              key={record.id}
              onPress={() => handleRemoveSelectedInterest(record.id)}
              title={<CaptionFour style={styles.chosenButtonText}>{record.hobbyName}</CaptionFour>}
            />
          ) : (
            <UnChosenButton
              containerStyle={styles.interestButtonContainer}
              buttonStyle={styles.interestButton}
              onPress={() => handleSelectInterest(record.id)}
              key={record.id}
              title={
                <CaptionFour style={styles.interestButtonTitle}>{record.hobbyName}</CaptionFour>
              }
            />
          ),
        )}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <ButtonTypeTwo
          onPress={handlePressSearch}
          containerStyle={{
            width: '100%',
            paddingTop: 70,
          }}
          title="搜尋"
        />
        <UnChosenButton
          onPress={handlePressClear}
          containerStyle={{
            width: '100%',
            paddingTop: 20,
          }}
          title="清除"
        />
      </View>
    </ScrollView>
  );
}
