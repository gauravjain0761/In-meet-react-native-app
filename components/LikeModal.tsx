import { View, Text, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery } from 'react-query';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ButtonTypeTwo } from './common/Button';
import { userApi } from '~/api/UserAPI';
import { selectAccount, selectToken } from '~/store/userSlice';
import Empty from '../assets/images/like-empty.png';
import LikeCircleCard from './common/Card/LikeCircleCard';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#383A44',
    borderRadius: 15,
    paddingVertical: 24,
    width: '100%',
    height: '85%',
  },
  inputWrapper: {
    backgroundColor: '#666F7387',
    borderRadius: 20,
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  titleText: { color: theme.colors?.black1, textAlign: 'center' },
  subTitleText: { color: theme.colors?.white, textAlign: 'center' },
  likeIconContainer: {
    marginTop: 15,
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 40,
    shadowColor: theme.colors?.black,
    backgroundColor: theme.colors?.white,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  diffText: { color: theme.colors?.black4, textAlign: 'center' },
  buttonStyle: {
    height: 40,
    width: 168,
  },
  textStyle: {
    fontSize: 14,
  },
  tabButton: {
    height: 33,
    width: 156,
  },
  tabButtonUnfocos: {
    height: 33,
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

interface ILikeModal {
  onClose: () => void;
  isVisible: boolean;
}

const TABS = {
  LIKE: 'like',
  VISIT: 'visit',
};

export default function LikeModal(props: ILikeModal) {
  const { isVisible, onClose } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const [tabSelected, setTabSelected] = useState(TABS.LIKE);
  const token = useSelector(selectToken);
  const account = useSelector(selectAccount);
  const [value, setValue] = useState('');

  const { isFetchingNextPage, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
    ['searchInterest', value],
    pageObject => userApi.findWhoLikeMe({ token, account }, pageObject),
  );

  const {
    isFetchingNextPage: watchedFetchingNextPage,
    fetchNextPage: watchedFetchNextPage,
    hasNextPage: watchedHasNextPage,
    data: watchedData,
  } = useInfiniteQuery(['searchWatched', value], pageObject =>
    userApi.findWhoWatchedMe({ token, account }, pageObject),
  );

  const watchedList = watchedData?.pages
    .map(page => {
      return page;
    })
    .flat();

  const interests = data?.pages
    .map(page => {
      return page;
    })
    .flat();

  const renderRow = ({ item, index }: { item: ILikeInfo }) => {
    return (
      <LikeCircleCard
        index={index}
        onClose={onClose}
        interest={{ ...item, ...item.user }}
        hideLikeIcon={tabSelected === TABS.VISIT}
      />
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
            fontSize: 16,
            lineHeight: 25,
            marginBottom: 4,
          }}>
          暫無資料
        </Text>
        <Text
          style={{
            color: theme.colors.black4,
            textAlign: 'center',
            fontSize: 14,
            lineHeight: 25,
          }}>
          別擔心，快到MEET尋找志同道合的朋友吧！
        </Text>
      </View>
    );
  };

  return (
    <ReactNativeModal
      animationInTiming={1000}
      animationOutTiming={1200}
      backdropOpacity={0.5}
      isVisible={isVisible}
      style={{ width: '100%', margin: 0 }}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          style={{
            backgroundColor: theme.colors.black1,
            width: 34,
            height: 34,
            borderRadius: 18,
            marginBottom: 16,
            marginLeft: '85%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="close" size={20} color="white" />
        </Pressable>
        <View style={styles.cardContainer}>
          <View style={{ backgroundColor: theme.colors.black1 }}>
            <View style={styles.inputWrapper}>
              <ButtonTypeTwo
                title="心動對象"
                buttonStyle={tabSelected === TABS.LIKE ? styles.tabButton : styles.tabButtonUnfocos}
                titleStyle={{ fontSize: 14 }}
                onPress={() => {
                  if (tabSelected !== TABS.LIKE) {
                    setTabSelected(TABS.LIKE);
                  }
                }}
              />
              <ButtonTypeTwo
                title="我看過誰"
                buttonStyle={
                  tabSelected === TABS.VISIT ? styles.tabButton : styles.tabButtonUnfocos
                }
                titleStyle={{ fontSize: 14 }}
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
              {interests?.length > 0 ? (
                <KeyboardAwareFlatList
                  numColumns={3}
                  style={[
                    {
                      flex: 1,
                      paddingHorizontal: 16,
                      backgroundColor: theme.colors.black1,
                    },
                  ]}
                  onEndReached={() => {
                    // handleLoadMore();
                    if (hasNextPage) {
                      fetchNextPage();
                    }
                  }}
                  onEndReachedThreshold={0.1}
                  data={interests}
                  keyExtractor={(item, index) => item.user.id.toString()}
                  renderItem={renderRow}
                  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                />
              ) : (
                renderEmpty()
              )}
            </>
          ) : (
            <>
              {watchedList?.length > 0 ? (
                <KeyboardAwareFlatList
                  numColumns={3}
                  contentContainerStyle={{ justifyContent: 'flex-start' }}
                  style={[
                    {
                      flex: 1,
                      paddingHorizontal: 16,
                      backgroundColor: theme.colors.black1,
                    },
                  ]}
                  onEndReached={() => {
                    // handleLoadMore();
                    if (watchedHasNextPage) {
                      watchedFetchNextPage();
                    }
                  }}
                  onEndReachedThreshold={0.1}
                  data={watchedList}
                  keyExtractor={(item, index) => item.user.id.toString()}
                  renderItem={renderRow}
                  ListFooterComponent={watchedFetchingNextPage ? <ActivityIndicator /> : null}
                />
              ) : (
                renderEmpty()
              )}
            </>
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
}
