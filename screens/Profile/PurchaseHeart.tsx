import { View, Platform, Alert } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  Purchase,
  useIAP,
  withIAPContext,
} from 'react-native-iap';

import { find, last } from 'lodash';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { ProfileStackScreenProps } from '../../navigation/ProfileNavigator';
import useCustomHeader from '../../hooks/useCustomHeader';
import { SubTitleOne } from '../../components/common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import {
  ButtonTypeFourChosen,
  ButtonTypeFourUnChosen,
  ButtonTypeTwo,
} from '../../components/common/Button';
import Loader from '~/components/common/Loader';
import { paymentApi } from '~/api/UserAPI';
import { getUserInfo, selectToken } from '~/store/userSlice';

const useStyles = makeStyles(() => ({
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
  blurContainer: {},
  buttonStyle: { height: 50, borderRadius: 15, backgroundColor: 'white' },
}));

const consumableSkus = Platform.select({
  ios: [
    'com.inmeet.inmeet.heart.three',
    'com.inmeet.inmeet.heart.five',
    'com.inmeet.inmeet.heart.twelve',
    'com.inmeet.inmeet.heart.thirty_six',
    'com.inmeet.inmeet.heart.seventy_two',
  ],
  android: [
    'com.inmeet.inmeet.heart.three',
    'com.inmeet.inmeet.heart.five',
    'com.inmeet.inmeet.heart.twelve',
    'com.inmeet.inmeet.heart.thirty_six',
    'com.inmeet.inmeet.heart.seventy_two',
  ],
});

enum POINT_TYPE {
  three = 'THREE',
  five = 'FIVE',
  twelve = 'TWELVE',
  thirty_six = 'THIRTY_SIX',
  seventy_two = 'SEVENTY_TWO',
}

function PurchaseHeart(props: ProfileStackScreenProps<'PurchaseHeart'>) {
  const { navigation } = props;
  useCustomHeader({ title: '追加愛心', navigation });
  const { theme } = useTheme();
  const [selectedCase, setSelectedCase] = React.useState('com.inmeet.inmeet.vip.three.moth');
  const styles = useStyles();
  const [loading, setLoading] = React.useState(false);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const updateUserInfo = () => {
    dispatch(getUserInfo({}));
  };
  const { mutate: addHeart, isLoading: isAddHeartLoading } = useMutation(paymentApi.addHeart, {
    onSuccess: () => {
      Alert.alert('提示', '購買成功');
    },
    onError: () => {
      alert('there was an error');
    },
    onSettled: () => {
      updateUserInfo();
    },
  });
  const { mutate: addAndroidHeart, isLoading: isAddAndroidHeartLoading } = useMutation(
    paymentApi.addAndroidHeart,
    {
      onSuccess: () => {
        Alert.alert('提示', '購買成功');
      },
      onError: () => {
        alert('there was an error');
      },
      onSettled: () => {
        updateUserInfo();
      },
    },
  );

  const { connected, products, currentPurchase, finishTransaction, getProducts, requestPurchase } =
    useIAP();
  const purchase = async () => {
    setLoading(true);
    try {
      const targetProduct = find(products, ['productId', selectedCase]);
      const { productId } = targetProduct || {};

      if (productId) {
        await requestPurchase(productId, undefined);
      } else {
        Toast.show('請選擇一種方案');
      }
    } catch (error) { }
    setLoading(false);
  };
  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      await flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) { }

    getProducts(consumableSkus);
  }, [getProducts]);
  useEffect(() => {
    if (connected) {
      fetchProducts();
    }
  }, [fetchProducts, connected]);
  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase) {
        const receipt = purchase.transactionReceipt;
        const { transactionId } = purchase;
        const pointType =
          POINT_TYPE[last(purchase.productId.split('.')) as keyof typeof POINT_TYPE] || '';

        if (receipt) {
          if (Platform.OS === 'ios') {
            try {
              //  add purchase backend here
              await addHeart({ token, transactionId, pointType, payload: receipt });
              await finishTransaction(purchase, true);
            } catch (ackErr) {
              Toast.show(JSON.stringify(ackErr));
            }
          }
          if (Platform.OS === 'android') {
            const body = {
              packageName: 'com.inmeet.inmeet',
              productId: purchase.productId,
              purchaseToken: purchase.purchaseToken as string,
              // type: !!purchase.autoRenewingAndroid,
            };
            try {
              await addAndroidHeart({ token, pointType, ...body });
              await finishTransaction(purchase, true);
            } catch (e) {
              Toast.show(JSON.stringify(e));
            }
          }
        }
      }
      setLoading(false);
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const purchaseCases = products
    .map(prd => ({
      id: prd.productId,
      caseMonths: prd.title.replace('(InMeet)', ''),
      dollars: prd.localizedPrice,
      price: prd.price,
    }))
    .sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });

  if (!connected)
    return <Spinner visible textContent="Loading..." textStyle={{ color: 'white' }} />;

  return (
    <Loader
      isLoading={loading || isAddHeartLoading || isAddAndroidHeartLoading || products.length === 0}>
      <View style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
        <View style={{ paddingHorizontal: 50, paddingVertical: 30 }}>
          {purchaseCases.map(purchaseCase =>
            purchaseCase.id === selectedCase ? (
              <ButtonTypeFourChosen
                onPress={() => { }}
                key={purchaseCase.id}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                months={
                  <>
                    <View style={{ paddingRight: 5 }}>
                      {mapIcon.likeIcon({ color: theme.colors.pink, size: 12 })}
                    </View>
                    {purchaseCase.caseMonths}
                  </>
                }
                dollars={purchaseCase.dollars}
              />
            ) : (
              <ButtonTypeFourUnChosen
                key={purchaseCase.id}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                onPress={() => setSelectedCase(purchaseCase.id)}
                months={
                  <>
                    <View style={{ paddingRight: 5 }}>
                      {mapIcon.likeIcon({ color: theme.colors.pink, size: 12 })}
                    </View>
                    {purchaseCase.caseMonths}
                  </>
                }
                dollars={purchaseCase.dollars}
              />
            ),
          )}

          <ButtonTypeTwo
            onPress={purchase}
            containerStyle={{ paddingTop: 10 }}
            title={<SubTitleOne style={{ color: theme.colors.white }}>購買愛心</SubTitleOne>}
          />
        </View>
      </View>
    </Loader>
  );
}

export default withIAPContext(PurchaseHeart);
