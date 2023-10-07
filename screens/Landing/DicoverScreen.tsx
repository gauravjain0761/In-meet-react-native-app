import { View, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, makeStyles, useTheme } from '@rneui/themed';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import { useInfiniteQuery, useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import Toast from 'react-native-root-toast';

import messaging from '@react-native-firebase/messaging';

import { mapIcon } from '../../constants/IconsMapping';

import SmallCard from '../../components/common/Card/SmallCard';

import { DicoverScreenProps, LandingScreenProps } from '../../navigation/LandingNavigator';

import { userApi, interestApi } from '~/api/UserAPI';
import userSlice, { selectToken, getUserLocation, getUserInfo } from '~/store/userSlice';
import { RootState, useAppDispatch } from '~/store';

import { getUserIsFromRegistered, storeUserIsFromRegistered } from '~/storage/userToken';

import useRequestLocation from '~/hooks/useRequestLocation';
import DicoverCard from '~/components/common/Card/DicoverCard';

const { height, width } = Dimensions.get('window');

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors?.black1,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarNavText: {
    color: theme.colors?.white,
  },
  storiesContainer: {
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: theme.colors?.white,
  },
  firstImageContainer: {
    marginLeft: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  imageName: {
    textAlign: 'center',
    paddingTop: 2,
    color: theme.colors?.white,
    width: '100%',
  },

  cardWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
}));

export default function DicoverScreen(props: DicoverScreenProps) {
  const { navigation } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>();
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const user = useSelector((state: RootState) => state.user);
  const { distance, interested, hobbyIds, endAge, startAge,} = user;
  const [openLocationAsync] = useRequestLocation();

  const {
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetchError,
    fetchNextPage,
    hasNextPage,
    data,
  } = useInfiniteQuery(
    ['searchUserInLandingScreen', distance, interested, endAge, startAge, hobbyIds],
    (pageObject) =>
      userApi.fetchUserpair({ token, gender: interested, hobbyId: hobbyIds, distance }, pageObject),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page.totalPage !== lastPage.page.currentPage) {
          return lastPage.page.currentPage + 1;
        }
        return undefined;
      },
      retry: 2,
      retryDelay: 3000,
    }
  );


  const { data: favoriteList } = useQuery('getFavoriteUser', () =>
    userApi.getFavoriteUser({ token })
  );

  const users = data?.pages.map((page) => page.records).flat();

  const handlePressFilter = () => {
    navigation.navigate('FilterSearchScreen');
  };

  const renderRow = ({ item }) => <DicoverCard user={item?.user} favoriteList={favoriteList?.records} />;



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ marginRight: 20 }} />
        {mapIcon.logoIcon({ size: 36 })}
        <Pressable onPress={()=>{}}>{mapIcon.pagesIcon({ size: 24 })}</Pressable>
      </View>
      <KeyboardAwareFlatList
        contentContainerStyle={{ paddingBottom: bottom }}
        numColumns={2}
        onEndReached={() => {
          if (hasNextPage && !isRefetchError) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        data={users?.slice(4)}
        columnWrapperStyle={styles.cardWrapper}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </SafeAreaView>
  );
}
