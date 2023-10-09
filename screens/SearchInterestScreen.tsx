import { View, Dimensions, TextInput, ActivityIndicator, Pressable, Image } from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { makeStyles, useTheme } from '@rneui/themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from 'react-query';
import { debounce } from 'lodash';
import { mapIcon } from '../constants/IconsMapping';
import InterestCard from '../components/common/Card/InterestCard';
import { BodyThree } from '../components/common/Text';
import { SearchInterestListProps } from '../navigation/InterestNavigator';
import Loader from '~/components/common/Loader';
import { interestApi, userApi } from '~/api/UserAPI';
import { selectToken, selectAccount, selectUserId } from '~/store/userSlice';
import { IInterest, ILikeInfo } from '~/store/interestSlice';
import { ButtonTypeTwo, ChosenButton } from '~/components/common/Button';
import LikeCard from '~/components/common/Card/LikeCard';
import { Text } from '~/components/Themed';
import SafeAreaView from 'react-native-safe-area-view';
import Empty from '../assets/images/like-empty.png';
import LikeModal from '~/components/LikeModal';
import { fontSize } from '~/helpers/Fonts';

const { height } = Dimensions.get('window');

const TABS = {
  LIKE: 'like',
  VISIT: 'visit',
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.black1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors?.black1,
    paddingTop: 30,
  },
  topBarNavText: {
    color: theme.colors?.white,
    fontWeight: '500',
    fontSize: 18,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    right: 0,
  },
  inputContainer: {
    position: 'relative',
    paddingBottom: 18,
  },
  inputWrapper: {
    backgroundColor: '#666F7387',
    borderRadius: 20,
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  tabButton: {
    height:35,
    width: 156,
  },
  tabButtonUnfocos: {
    height:35,
    width: 156,
    backgroundColor: 'transparent',
  },
  emptyWrapper: {
    backgroundColor: theme.colors?.black1,
    height: '100%',
    paddingHorizontal: 90,
    paddingTop: 80,
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function SearchInterestScreen(props: SearchInterestListProps) {
  const styles = useStyles();
  const [value, setValue] = useState('');
  const { theme } = useTheme();
  const token = useSelector(selectToken);
  const account = useSelector(selectAccount);
  const id = useSelector(selectUserId);
  const [tabSelected, setTabSelected] = useState(TABS.LIKE);
  const [modalOpen, setModalOpen] = useState(false);

  // const { isFetchingNextPage, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
  //   ['searchInterest'],
  //   pageObject => userApi.findWhoLikeMe({ token, id }, pageObject),
  // );
  const {isLoading , isFetchingNextPage, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
    ['searchInterest'],
    pageObject => userApi.findUserpairLikeMe({ token, id }, pageObject),
  );
// console.log('data',data);

  // const {
  //   isFetchingNextPage: watchedFetchingNextPage,
  //   fetchNextPage: watchedFetchNextPage,
  //   hasNextPage: watchedHasNextPage,
  //   data: watchedData,
  // } = useInfiniteQuery(['searchWatched', value], pageObject =>
  //   userApi.findWhoWatchedMe({ token, id }, pageObject),
  // );
  const {
    isLoading:watchedisLoading,
    isFetchingNextPage: watchedFetchingNextPage,
    fetchNextPage: watchedFetchNextPage,
    hasNextPage: watchedHasNextPage,
    data: watchedData,
  } = useInfiniteQuery(['searchWatched', value], pageObject =>
    userApi.findUserpairWatchedMe({ token, id }, pageObject),
  );

  const watchedList = watchedData?.pages
    .map(page => {
      return page?.records;
    })
    .flat();

  const interests = data?.pages
    .map(page => {
      return page?.records;
    })
    .flat();


    console.log('interests',watchedList);
    
  const renderRow = ({ item }: { item: ILikeInfo }) => {
    return (
      <LikeCard interest={{ ...item?.user, ...item.user,}} hideLikeIcon={tabSelected === TABS.VISIT} />
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyWrapper}>
        <Image style={{ width: 180, height: 136, marginBottom: 4 }} source={Empty} />
        <Text
          style={{
            color: theme.colors.black4,
            textAlign: 'center',
            fontSize: fontSize(16),
            lineHeight: 25,
            marginBottom: 4,
            fontFamily:'roboto'
          }}>
          暫無資料
        </Text>
        <Text
          style={{
            color: theme.colors.black4,
            textAlign: 'center',
            fontSize: fontSize(14),
            lineHeight: 25,
            fontFamily:'roboto'
          }}>
         {"別擔心，快到MEET尋找志\n同道合的朋友吧！"}
        </Text>
      </View>
    );
  };

  return (
    <Loader isLoading={isLoading || watchedisLoading}>
      <LikeModal isVisible={modalOpen} onClose={() => setModalOpen(false)} />
      <SafeAreaView  style={styles.header}>
        <BodyThree style={styles.topBarNavText}>LIKE</BodyThree>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            borderColor: '#6F7387',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {mapIcon.footprintIcon()}
        </Pressable>
      </SafeAreaView>
      <View style={{ backgroundColor: theme.colors.black1 }}>
        <View style={styles.inputWrapper}>
          <ButtonTypeTwo
            title="誰喜歡我"
            buttonStyle={tabSelected === TABS.LIKE ? styles.tabButton : styles.tabButtonUnfocos}
            titleStyle={{ fontSize: fontSize(14),bottom:2 }}
            onPress={() => {
              if (tabSelected !== TABS.LIKE) {
                setTabSelected(TABS.LIKE);
              }
            }}
          />
          <ButtonTypeTwo
            title="誰來看我"
            buttonStyle={tabSelected === TABS.VISIT ? styles.tabButton : styles.tabButtonUnfocos}
            titleStyle={{ fontSize: fontSize(14),bottom:2 }}
            onPress={() => {
              if (tabSelected !== TABS.VISIT) {
                setTabSelected(TABS.VISIT);
              }
            }}
          />
        </View>
      </View>
      {tabSelected === TABS.LIKE ? (
        <>
          {(interests?.length > 0)? (
            <KeyboardAwareFlatList
              numColumns={2}
              style={[
                styles.container,
                { flex: 1, paddingHorizontal: 16, backgroundColor: theme.colors.black1 },
              ]}
              onEndReached={() => {
                // handleLoadMore();
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.1}
              data={interests}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
            />
          ) : (
            renderEmpty()
          )}
        </>
      ) : (
        <>
          {(watchedList?.length > 0) ? (
            <KeyboardAwareFlatList
              numColumns={2}
              style={[
                styles.container,
                { flex: 1, paddingHorizontal: 16, backgroundColor: theme.colors.black1 },
              ]}
              onEndReached={() => {
                // handleLoadMore();
                if (watchedHasNextPage) {
                  watchedFetchNextPage();
                }
              }}
              onEndReachedThreshold={0.1}
              data={watchedList}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              ListFooterComponent={watchedFetchingNextPage ? <ActivityIndicator /> : null}
            />
          ) : (
            renderEmpty()
          )}
        </>
      )}
    </Loader>
  );
}
