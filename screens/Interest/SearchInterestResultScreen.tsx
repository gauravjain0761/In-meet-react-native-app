import { View, Text, Dimensions } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ConstellationResultScreenProps } from '../../navigation/LandingNavigator';
import SmallCard from '../../components/common/Card/SmallCard';
import ConstellationCard from '../../components/common/Card/ConstellationCard';
import { BodyThree } from '../../components/common/Text';
import { SearchInterestResultScreenProps } from '../../navigation/InterestNavigator';
import { userApi } from '~/api/UserAPI';
import { selectToken } from '~/store/userSlice';

const { height, width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.black1,
    minHeight: height,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardBanner: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
}));

export default function SearchInterestResultScreen(props: SearchInterestResultScreenProps) {
  const { navigation, route } = props;
  const { theme } = useTheme();
  const { bottom, top } = useSafeAreaInsets();
  const styles = useStyles();
  const { interest, count, id } = route.params;
  const token = useSelector(selectToken);

  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      `searchUserByInterest${id}`,
      pageObject => userApi.fetchUserByInterest({ token, hobbyId: id }, pageObject),
      {
        getNextPageParam: lastPage => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      },
    );

  const { data: favoriteList } = useQuery(
    'getFavoriteUser',
    () => userApi.getFavoriteUser({ token }),
    {
      refetchOnMount: true,
    },
  );

  const users = data?.pages.map(page => page.records).flat();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitle: props => {
        return <BodyThree style={styles.headerTitle}>{interest}</BodyThree>;
      },
    });
  });
  return (
    <SafeAreaView style={[styles.container, { top: -top }]}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.black1 }}
        contentContainerStyle={{ paddingBottom: bottom * 2 }}>
        <View style={styles.cardBanner}>
          <ConstellationCard title={`探索${interest}`} description={`${users?.length || 0}人`} />
        </View>

        {/* Card Component */}
        <View style={styles.cardWrapper}>
          {users?.map(user => (
            <SmallCard key={user.id} user={user} favoriteList={favoriteList?.records} />
          ))}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
