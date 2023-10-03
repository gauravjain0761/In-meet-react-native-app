/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  View,
  Text,
  useWindowDimensions,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
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
import { BodyThree, BodyTwo, SubTitleOne, SubTitleTwo } from '../../components/common/Text';
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
import { fontSize } from '~/helpers/Fonts';
import SafeAreaView from 'react-native-safe-area-view';
import Illus4 from '../../assets/images/firstLogin/Illus4.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = makeStyles((theme) => ({
  carouselImage: {
    // width: '100%',
    // aspectRatio: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 20,
    marginTop: 30,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  buttonStyle: { height: 50, borderRadius: 15, backgroundColor: 'white' },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitleStyle: {
    color: theme.colors?.white,
    fontSize: fontSize(18),
    fontWeight: '500',
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
  avatarDisplayName: {
    color: theme.colors?.white,
    fontSize: fontSize(18),
    marginRight: 40,
  },
  vipText: {
    color: theme.colors?.white,
  },
  vipSubText: {
    color: theme.colors?.black4,
  },
  headerText: {
    color: theme.colors.white,
  },
  vipCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 16,
    marginTop: 10,
  },
  vipCardRight: {
    width: 60,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  vipCardRightText: {
    fontSize: fontSize(12),
    lineHeight: 12,
    backgroundColor: '#FBBC05',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  vipContent: {
    flexDirection: 'row',
    height: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  vipDiviStyle: {
    width: 1,
    borderWidth: 0.5,
    marginLeft: 10,
    marginRight: 6,
    borderColor: theme.colors.black2,
    height: 18,
  },
  vipShowValue: {
    backgroundColor: theme.colors.pink,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  vipFooterContent: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: '#292C33',
    top: 80,
    borderRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flex: 1,
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

const vipDataList = [
  {
    id: 1,
    title1: '一年制',
    title2: '$290/月',
    showValue: '49折',
    vipCard: true,
    NTText: 'NT$348, 一次付清',
    isSelect: true,
  },
  {
    id: 2,
    title1: '3個月',
    title2: '$390/月',
    showValue: '49折',
    vipCard: false,
    NTText: 'NT$348, 一次付清',
    isSelect: false,
  },
  {
    id: 3,
    title1: '1個月',
    title2: '$590/月',
    vipCard: false,
    NTText: 'NT$348, 一次付清',
    isSelect: false,
  },
];

function VIPPurchaseScreen(props: ProfileStackScreenProps<'VIPPurchaseScreen'>) {
  const { navigation } = props;
  const { theme } = useTheme();
  const { bottom, top } = useSafeAreaInsets();

  const [activeSlide, setActiveSlide] = React.useState(0);
  const [selectedCase, setSelectedCase] = React.useState('com.inmeet.inmeet.vip.three.moth');
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [vipData, setVipData] = React.useState(vipDataList);
  const [subscribedProductId, setSubscribedProdutId] = React.useState<string>();
  const data = [
    {
      bannerIcon: mapIcon.vip1,
      description: '查看誰喜歡我誰看過我',
    },
    {
      bannerIcon: mapIcon.vip2,
      description: '隱藏聊天紀錄，保護隱私',
    },
    {
      bannerIcon: mapIcon.vip3,
      description: '可封鎖用戶，不再被打擾',
    },
    {
      bannerIcon: mapIcon.vip4,
      description: '按錯隨時反悔',
    },
    {
      bannerIcon: mapIcon.vip5,
      description: '查看訪問足跡，不錯過任何對象',
    },
    {
      bannerIcon: mapIcon.vip6,
      description: '查看訪問足跡，不錯過任何對象',
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
    } catch (error) {}
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
    }
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
    } catch (err) {}

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
        (a, b) => b.transactionDate - a.transactionDate
      );

      const latestAvailableReceipt = sortedAvailablePurchases?.[0]?.transactionReceipt;

      const isTestEnvironment = __DEV__;

      const decodedReceipt = await validateReceiptIos(
        {
          'receipt-data': latestAvailableReceipt,
          password: '90398a960b8b489ba96f5beb56b58e0d',
        },
        isTestEnvironment
      );

      if (decodedReceipt) {
        const { latest_receipt_info: latestReceiptInfo } =
          decodedReceipt as ReceiptValidationResponse;

        const expirationInMilliseconds = Number(
          // @ts-ignore
          latestReceiptInfo[0]?.expires_date_ms
        );
        const nowInMilliseconds = Date.now();

        if (expirationInMilliseconds > nowInMilliseconds) {
          Alert.alert(
            '恢復購買',
            `你已恢復購買，目前會員狀態是${
              sortedAvailablePurchases?.[0].productId ? 'VIP' : '普通會員'
            }`
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
    } catch (error) {}
    setLoading(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
    });
  });

  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselImage}>
        <Image source={item.bannerIcon} resizeMode="contain" style={{ width: 170, height: 130 }} />
        <BodyThree style={{ color: theme.colors.white }}>{item.description}</BodyThree>
      </View>
    );
  };

  const HeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
          top: top + 10,
        }}>
        <TouchableOpacity onPress={navigation.goBack} style={{}}>
          {mapIcon.backIcon({ size: 28 })}
        </TouchableOpacity>
        <SubTitleTwo style={styles.avatarDisplayName}>{'升級VIP'}</SubTitleTwo>
        <View />
      </View>
    );
  };
  const purchaseCases = subscriptions
    .map((prd) => ({
      id: prd.productId,
      caseMonths:
        Platform.OS === 'ios'
          ? `${
              subscribedProductId === prd.productId
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

  // if (!connected)
  //   return <Spinner visible textContent="Loading..." textStyle={{ color: 'white' }} />;

  const onFilterPress = (item: any) => {
    const updateData = vipData.map((list) => {
      if (item.id === list.id) {
        return {
          ...list,
          isSelect: true,
        };
      } else {
        return {
          ...list,
          isSelect: false,
        };
      }
    });
    setVipData(updateData);
  };

  const VipCardSelect = ({ data }: any) => {
    const showCard=vipData.filter((item)=>item.isSelect ===true)
    return (
      <TouchableOpacity
        onPress={() => {
          onFilterPress(data);
        }}
        style={[styles.vipCard, { borderColor: data.isSelect == true ? '#FBBC05' : '#6F7387' }]}>
        {(data?.vipCard && showCard[0].id === 1) && (
          <View style={styles.vipCardRight}>
            <SubTitleTwo style={[styles.vipText, styles.vipCardRightText]}>{'最優惠'}</SubTitleTwo>
          </View>
        )}
        <View style={styles.vipContent}>
          <SubTitleTwo style={styles.vipText}>{data?.title1}</SubTitleTwo>
          <View style={styles.vipDiviStyle} />
          <SubTitleTwo style={styles.vipText}>{data?.title2}</SubTitleTwo>
          {data?.showValue && (
            <View style={styles.vipShowValue}>
              <SubTitleTwo style={[styles.vipText, { fontSize: fontSize(12), lineHeight: 12 }]}>
                {data?.showValue}
              </SubTitleTwo>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
          <BodyTwo style={styles.vipSubText}>{data?.NTText}</BodyTwo>
          {/* <BodyTwo style={styles.vipSubText}>{'升級VIP'}</BodyTwo> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // <Loader
    //   isLoading={
    //     loading || isAddVIPLoading || isAddAndroidVIPLoading || subscriptions.length === 0
    //   }>
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      <Image
        source={Illus4}
        style={{
          width: 400,
          height: 200,
          position: 'absolute',
          // top: 8.5,
          // left: 88.4,
        }}
      />
      <HeaderView />

      <View style={{ marginTop: 30 }}>
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
            bottom: -30,
            paddingBottom: 0,
          }}
          dotContainerStyle={{
            marginHorizontal: 2,
          }}
          dotStyle={{
            width: 18,
            height: 8,
            borderRadius: 8,
          }}
          dotColor={theme.colors.white}
          inactiveDotScale={1}
          inactiveDotStyle={{ width: 8, height: 8, borderRadius: 4 }}
          inactiveDotColor="#C4C4C4"
        />
      </View>
      <View style={styles.vipFooterContent}>
        {/* {purchaseCases.map(purchaseCase =>
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
          )} */}
          <ScrollView style={{marginBottom:90}}>

        <BodyTwo style={styles.headerText}>收費方式</BodyTwo>
        {vipData.map((item) => {
          return <VipCardSelect data={item} />;
        })}
          </ScrollView>
      </View>
      <ButtonTypeTwo
        title={<SubTitleOne style={{ color: theme.colors.white }}>立即升級</SubTitleOne>}
        onPress={purchase}
        buttonStyle={{ height: 55 }}
        containerStyle={{ marginHorizontal: 40, bottom: bottom + 30 }}
      />
    </SafeAreaView>
    // </Loader>
  );
}

export default withIAPContext(VIPPurchaseScreen);
