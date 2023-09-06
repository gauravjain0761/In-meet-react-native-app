import { View, Text, useWindowDimensions, ActivityIndicator, Image } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { SceneMap, TabBar, TabBarItem, TabView } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { BlurView } from 'expo-blur';
import { RootStackScreenProps } from '../../types';
import { BodyThree, BodyTwo, CaptionFour, SubTitleTwo } from '../../components/common/Text';

import { userApi } from '~/api/UserAPI';
import { selectToken, selectUserId } from '~/store/userSlice';
import Loader from '~/components/common/Loader';
import SmallCard from '~/components/common/Card/SmallCard';
import { ButtonTypeTwo } from '~/components/common/Button';
import { RootState } from '~/store';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  centerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -75 }],
    width: 200,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function UserListComponent({ navigationProps: navigation }) {
  const { bottom } = useSafeAreaInsets();

  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      `fetchFavoriteUserList`,
      pageObject => userApi.fetchFavoriteUserList({ token }, pageObject),
      {
        getNextPageParam: lastPage => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      },
    );

  const users = data?.pages.map(page => page.records).flat();

  const handlePressStory = () => {
    navigation.push('MatchingDetailScreen');
  };

  const handlePressConstellationCard = () => {
    navigation.push('ConstellationSearchScreen');
  };

  const handlePressFilter = () => {
    navigation.navigate('FilterSearchScreen');
  };
  const renderRow = ({ item }) => <SmallCard user={item.favoriteUser} favoriteList={users} />;

  return (
    <Loader isLoading={isLoading}>
      <KeyboardAwareFlatList
        contentContainerStyle={{ paddingTop: 10 }}
        numColumns={2}
        onEndReached={() => {
          // handleLoadMore();
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        data={users}
        columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderRow}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </Loader>
  );
}

function CollectedMeComponent({ navigationProps: navigation }) {
  const { bottom } = useSafeAreaInsets();
  const styles = useStyles();

  const token = useSelector(selectToken);
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const userId = useSelector(selectUserId);
  const { isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery(
      `fetchWhoFavoriteMe`,
      pageObject => userApi.fetchWhoFavoriteMe({ token, userId }, pageObject),
      {
        getNextPageParam: lastPage => {
          if (lastPage.page.totalPage !== lastPage.page.currentPage) {
            return lastPage.page.currentPage + 1;
          }
          return undefined;
        },
      },
    );

  const { data: favoriteList } = useQuery('getFavoriteUser', () =>
    userApi.getFavoriteUser({ token }),
  );
  const users = data?.pages
    .map(page => page.records)
    .flat()
    .map(item => ({
      ...item.collector,
    }));

  const renderRow = ({ item }) => <SmallCard user={item} favoriteList={favoriteList?.records} />;

  return (
    <Loader isLoading={isLoading}>
      <View style={{ flex: 1 }}>
        <KeyboardAwareFlatList
          contentContainerStyle={{ paddingTop: 10 }}
          numColumns={2}
          onEndReached={() => {
            // handleLoadMore();
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.1}
          data={users}
          columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={renderRow}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        />
        {!isVIP && (
          <>
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 1,
              }}
              intensity={80}
              tint="dark">
              <Image
                style={{ width: '100%', height: '100%', opacity: 0.6 }}
                blurRadius={20}
                source={{
                  uri: `https://via.placeholder.com/200x300?text=Default`,
                }}
              />
            </BlurView>
            <View style={{ ...styles.centerContainer, zIndex: 2 }}>
              <SubTitleTwo style={{ textAlign: 'center', paddingBottom: 10 }}>
                加入VIP 查看有誰收藏了我
              </SubTitleTwo>
              <ButtonTypeTwo
                onPress={() => {
                  navigation.push('PurchaseVIPScreen');
                }}
                title="立即加入"
              />
            </View>
          </>
        )}
      </View>
    </Loader>
  );
}

export default function CollectionScreen(props: RootStackScreenProps<'ProfileDetail'>) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { navigation: navigationProps } = props;
  const navigation = useNavigation();
  const [routes] = React.useState([
    { key: 'first', title: '我的收藏' },
    { key: 'second', title: '收藏我的' },
  ]);
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: props => {
        return (
          <BodyTwo
            style={{
              color: theme.colors?.white,
            }}>
            收藏
          </BodyTwo>
        );
      },
    });
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      {/* Description */}
      <TabView
        initialLayout={{ width }}
        renderTabBar={props => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: theme.colors.black1,
              }}
              renderTabBarItem={props => {
                return (
                  <TabBarItem
                    {...props}
                    style={{
                      position: 'relative',
                      zIndex: -1,
                      borderBottomColor: theme.colors.black3,
                      marginLeft: 10,
                      marginRight: 10,
                      borderBottomWidth: 2,
                    }}
                  />
                );
              }}
              contentContainerStyle={{}}
              indicatorContainerStyle={{
                zIndex: 1,
              }}
              indicatorStyle={{
                marginLeft: 10,
                width: (width - 40) / 2,
                backgroundColor: theme.colors.pink,
              }}
            />
          );
        }}
        sceneContainerStyle={{
          // backgroundColor: 'red',
          overflow: 'visible',
        }}
        pagerStyle={
          {
            // backgroundColor: 'blue',
          }
        }
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: () => <UserListComponent navigationProps={navigationProps} />,
          second: () => <CollectedMeComponent navigationProps={navigation} />,
        })}
        onIndexChange={setIndex}
      />
    </View>
  );
}
