/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  View,
  Text,
  useWindowDimensions,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { makeStyles, useTheme, Button } from '@rneui/themed';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import RNIap, {
  Purchase,
  useIAP,
  withIAPContext,
  validateReceiptIos,
  flushFailedPurchasesCachedAsPendingAndroid,
  acknowledgePurchaseAndroid,
} from 'react-native-iap';

import { find, findIndex, get, isEmpty, last } from 'lodash';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-root-toast';
import { ReceiptValidationResponse } from 'react-native-iap/src/types/apple';
import { HeaderBackButton } from '@react-navigation/elements';
import { differenceInMonths } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { BodyThree, BodyTwo, SubTitleOne } from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import {
  ButtonTypeFourChosen,
  ButtonTypeFourUnChosen,
  ButtonTypeTwo,
} from '../../components/common/Button';
import Loader from '~/components/common/Loader';
import { useAppDispatch } from '~/store';
import { getUserInfo, selectToken } from '~/store/userSlice';
import { paymentApi } from '~/api/UserAPI';

const useStyles = makeStyles(theme => ({
  carouselImage: {
    width: '100%',
    aspectRatio: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  buttonStyle: { height: 50, borderRadius: 15, backgroundColor: 'white' },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  helpContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  helpLink: { color: theme.colors.white, textAlign: 'center', textAlignVertical: 'center' },
  helpLinkText: {
    color: theme.colors?.pink,
    textDecorationLine: 'underline',
  },
}));

const subSkus = Platform.select({
  ios: [
    'renewable.inmeet.vip.one.month',
    'renewable.inmeet.vip.three.month',
    'renewable.inmeet.vip.six.month',
  ],
  android: [
    'com.inmeet.inmeet.vip.one.month',
    'com.inmeet.inmeet.vip.three.month',
    'com.inmeet.inmeet.vip.six.month',
  ],
});
const title = Platform.select({
  ios: {
    'renewable.inmeet.vip.one.month': '1個月',
    'renewable.inmeet.vip.three.month': '3個月',
    'renewable.inmeet.vip.six.month': '6個月',
  },
  android: {
    'com.inmeet.inmeet.vip.one.month': '1個月VIP',
    'com.inmeet.inmeet.vip.three.month': '3個月VIP',
    'com.inmeet.inmeet.vip.six.month': '6個月VIP',
  },
});
enum VIP_TYPE {
  one = 'ONE',
  three = 'THREE',
  six = 'SIX',
}
const iapSkus = subSkus;

function PurchaseVIPScreen(props: ProfileStackScreenProps<'PurchaseVIPScreen'>) {
  const { navigation } = props;
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [selectedCase, setSelectedCase] = React.useState('com.inmeet.inmeet.vip.three.moth');
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [subscribedProductId, setSubscribedProdutId] = React.useState<string>();
  const data = [
    {
      bannerIcon: mapIcon.likeIcon({ color: theme.colors.pink, size: 50 }),
      description: '無限量愛心, 盡情喜歡',
    },
    {
      bannerIcon: mapIcon.chatIcon({ color: theme.colors.green, size: 50 }),
      description: '隱藏聊天記錄, 保護隱私',
    },
    {
      bannerIcon: mapIcon.blockIcon({ color: theme.colors.purple, size: 50 }),
      description: '可封鎖用戶, 不再被打擾',
    },
    {
      bannerIcon: mapIcon.profileIcon({ color: theme.colors.pink, size: 50 }),
      description: '可索取用戶聯絡資訊, 取得更多聯繫',
    },
  ];
  const {
    connected,
    subscriptions,
    currentPurchase,
    currentPurchaseError,
    finishTransaction,
    getSubscriptions,
    requestSubscription,
  } = useIAP();
  const token = useSelector(selectToken);

  const dispatch = useAppDispatch();
  const updateUserInfo = () => {
    try {
      setLoading(true);
      dispatch(getUserInfo({}));
    } catch (error) { }
    setLoading(false);
  };
  const { mutate: addVIP, isLoading: isAddVIPLoading } = useMutation(paymentApi.addVIP, {
    onSuccess: () => {
      Alert.alert('提示', '訂閱成功');
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      updateUserInfo();
    },
  });
  const { mutate: addAndroidVIP, isLoading: isAddAndroidVIPLoading } = useMutation(
    paymentApi.addAndroidVIP,
    {
      onSuccess: () => {
        Alert.alert('提示', '訂閱成功');
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        updateUserInfo();
      },
    },
  );

  const getSubcribedProuduct = useCallback(async (): Promise<void> => {
    setSubscribedProdutId(await getActiveSubscriptionId());
  }, []);
  const purchase = async () => {
    setLoading(true);
    try {
      const targetProduct = find(subscriptions, ['productId', selectedCase]);
      const { productId, type } = targetProduct || {};

      if (productId) {
        await requestSubscription(productId);
      } else {
        Toast.show('請選擇一種方案');
      }
      throw new Error();
    } catch (error) {
      console.log('error: ', error);
    }
    setLoading(false);
  };

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      await flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) { }

    getSubscriptions(iapSkus);
  }, [getSubscriptions]);

  useEffect(() => {
    if (connected) {
      fetchProducts();
    }
  }, [fetchProducts, connected]);

  const getActiveSubscriptionId = async (): Promise<string | undefined> => {
    if (Platform.OS === 'ios') {
      const availablePurchases = await RNIap.getAvailablePurchases();

      const sortedAvailablePurchases = availablePurchases.sort(
        (a, b) => b.transactionDate - a.transactionDate,
      );

      const latestAvailableReceipt = sortedAvailablePurchases?.[0]?.transactionReceipt;

      const isTestEnvironment = __DEV__;

      const decodedReceipt = await validateReceiptIos(
        {
          'receipt-data': latestAvailableReceipt,
          password: '90398a960b8b489ba96f5beb56b58e0d',
        },
        isTestEnvironment,
      );

      if (decodedReceipt) {
        const { latest_receipt_info: latestReceiptInfo } =
          decodedReceipt as ReceiptValidationResponse;

        const expirationInMilliseconds = Number(
          // @ts-ignore
          latestReceiptInfo[0]?.expires_date_ms,
        );
        const nowInMilliseconds = Date.now();

        if (expirationInMilliseconds > nowInMilliseconds) {
          Alert.alert(
            '恢復購買',
            `你已恢復購買，目前會員狀態是${sortedAvailablePurchases?.[0].productId ? 'VIP' : '普通會員'
            }`,
          );
          return sortedAvailablePurchases?.[0].productId;
        }
      }

      return undefined;
    }

    if (Platform.OS === 'android') {
      const availablePurchases = await RNIap.getAvailablePurchases();

      for (let i = 0; i < availablePurchases.length; i++) {
        if (subSkus.includes(availablePurchases[i].productId)) {
          return availablePurchases[i].productId;
        }
      }

      return undefined;
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase) {
        const receipt = purchase.transactionReceipt;
        const { transactionId } = purchase;
        const vipType =
          VIP_TYPE[last(purchase.productId.split('.').slice(0, -1)) as keyof typeof VIP_TYPE] || '';
        if (receipt) {
          if (Platform.OS === 'ios') {
            try {
              await finishTransaction(purchase, subSkus.includes(purchase.productId));
              //  add purchase backend here
              await addVIP({ token, transactionId, vipType, payload: receipt });
            } catch (ackErr) {
              console.warn('ackErr', ackErr);
            }
          }
          if (Platform.OS === 'android') {
            try {
              await finishTransaction(purchase);
              const body = {
                packageName: 'com.inmeet.inmeet',
                productId: purchase.productId,
                purchaseToken: purchase.purchaseToken as string,
              };
              await addAndroidVIP({ token, vipType, ...body });
            } catch (error) {
              Toast.show(JSON.stringify(error));
            }
          }
        }
      }
      setLoading(false);
    };
    checkCurrentPurchase(currentPurchase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPurchase]);

  useEffect(() => {
    if (currentPurchaseError) {
      Alert.alert('使用者取消付款');
    }
  }, [currentPurchaseError]);

  async function isSubscriptionActive() {
    setLoading(true);
    try {
      await getSubcribedProuduct();
    } catch (error) { }
    setLoading(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () =>
        Platform.OS === 'android' ? null : (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
      headerTitle: () => {
        return <BodyTwo style={styles.headerTitle}>升級VIP會員</BodyTwo>;
      },
      headerRight: () => {
        return (
          Platform.OS === 'ios' && (
            <Button
              onPress={() => isSubscriptionActive()}
              buttonStyle={{ backgroundColor: theme.colors?.black1 }}
              titleStyle={{ color: 'white', fontWeight: '400', fontSize: 14 }}
              title="恢復購買"
            />
          )
        );
      },
    });
  });

  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselImage}>
        {item.bannerIcon}
        <BodyThree style={{ color: theme.colors.white, paddingTop: 20 }}>
          {item.description}
        </BodyThree>
      </View>
    );
  };

  const purchaseCases = subscriptions
    .map(prd => ({
      id: prd.productId,
      caseMonths:
        Platform.OS === 'ios'
          ? `${subscribedProductId === prd.productId
            ? `現在方案${title[prd.productId]}`
            : title[prd.productId]
          }`
          : prd.title.replace('(InMeet)', ''),
      dollars: prd.localizedPrice,
      price: prd.price,
    }))
    .sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });

  function handleHelpPress() {
    WebBrowser.openBrowserAsync('https://inmeet.vip/terms-of-use');
  }

  if (!connected)
    return <Spinner visible textContent="Loading..." textStyle={{ color: 'white' }} />;

  return (
    <Loader
      isLoading={
        loading || isAddVIPLoading || isAddAndroidVIPLoading || subscriptions.length === 0
      }>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        <View style={{ position: 'relative' }}>
          <Carousel
            onSnapToItem={setActiveSlide}
            data={data}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            containerStyle={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              paddingBottom: 0,
            }}
            dotContainerStyle={{
              marginHorizontal: 2,
            }}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 4,
            }}
            dotColor={theme.colors.white}
            inactiveDotScale={1}
            inactiveDotColor="#C4C4C4"
          />
        </View>
        <View style={{ paddingHorizontal: 50, paddingVertical: 30 }}>
          {purchaseCases.map(purchaseCase =>
            purchaseCase.id === selectedCase ? (
              <ButtonTypeFourChosen
                onPress={() => { }}
                key={purchaseCase.id}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                months={purchaseCase.caseMonths}
                dollars={purchaseCase.dollars}
              />
            ) : (
              <ButtonTypeFourUnChosen
                key={purchaseCase.id}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                onPress={() => {
                  setSelectedCase(purchaseCase.id);
                }}
                months={purchaseCase.caseMonths}
                dollars={purchaseCase.dollars}
              />
            ),
          )}

          <ButtonTypeTwo
            onPress={purchase}
            containerStyle={{ paddingTop: 10 }}
            title={<SubTitleOne style={{ color: theme.colors.white }}>立即升級</SubTitleOne>}
          />
          <View style={styles.helpContainer}>
            <BodyThree style={styles.helpLink}>
              點選「立即升級」後，系統將向你的App
              Store付款方式收費，且你的訂閱將依相同的價格及方案使用期限自動續訂，直到你隨時透過App
              Store 的設定取消訂閱為止，而你也同意我們的
              <BodyThree onPress={() => handleHelpPress()} style={styles.helpLinkText}>
                服務條款
              </BodyThree>
            </BodyThree>
          </View>
        </View>
      </View>
    </Loader>
  );
}

export default withIAPContext(PurchaseVIPScreen);
