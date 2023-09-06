import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect } from 'react';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import { makeStyles, useTheme } from '@rneui/themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { ConstellationResultScreenProps } from '../../navigation/LandingNavigator';
import SmallCard from '../../components/common/Card/SmallCard';
import ConstellationCard from '../../components/common/Card/ConstellationCard';
import { BodyThree, CaptionFive } from '../../components/common/Text';
import { userApi } from '~/api/UserAPI';
import { selectToken } from '~/store/userSlice';
import Loader from '~/components/common/Loader';

const { height, width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.black1,
    // minHeight: height,
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
  },
  cardBanner: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
}));

export default function ConstellationResultScreen(props: ConstellationResultScreenProps) {
  const { navigation, route } = props;
  const { params } = route;
  const { theme } = useTheme();
  const { bottom, top } = useSafeAreaInsets();
  const styles = useStyles();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitle: props => {
        return <BodyThree style={styles.headerTitle}>星座配對</BodyThree>;
      },
    });
  });

  const { constellation = '' } = params;
  const token = useSelector(selectToken);

  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      `searchUserByConstellation${constellation}`,
      pageObject => userApi.fetchUserByConstellation({ token, constellation }, pageObject),
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

  const allFavoriteUserIds = favoriteList?.records.map(record => record.id);
  const users = data?.pages.map(page => page.records).flat();

  const renderRow = ({ item }) => <SmallCard user={item} favoriteList={favoriteList?.records} />;

  const totalCount = get(data, 'pages[0].page.totalCount', 0);
  return (
    <Loader isLoading={isLoading}>
      <KeyboardAwareFlatList
        style={[styles.container]}
        numColumns={2}
        onEndReached={() => {
          // handleLoadMore();
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        data={users}
        contentContainerStyle={{ paddingBottom: -bottom }}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderRow}
        ListHeaderComponent={
          <View style={styles.cardBanner}>
            <ConstellationCard title={`探索${constellation}`} description={`${totalCount}人`} />
          </View>
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </Loader>
  );
  return (
    <SafeAreaView style={[styles.container, { top: -top }]}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.black1 }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <View style={styles.cardBanner}>
          <ConstellationCard title="探索水瓶座" description="244人" />
        </View>

        {/* Card Component */}
        <View style={styles.cardWrapper}>
          {users?.map(user => (
            <SmallCard
              key={user.id}
              user={user}
              isCollected={Boolean(allFavoriteUserIds?.includes(user.id))}
            />
          ))}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
