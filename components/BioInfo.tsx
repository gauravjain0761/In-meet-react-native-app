import { View, Text } from 'react-native';
import React from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { get } from 'lodash';
import { CaptionFour, SubTitleOne, TitleOne } from './common/Text';
import { mapIcon } from '../constants/IconsMapping';
import { UN_KNOWN, UN_RECOGNIZED } from '~/constants/defaultValue';
import { calculateAge } from '~/helpers/convertDate';

const useStyles = makeStyles(theme => ({
  bioTitleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bioName: {
    color: theme.colors?.white,
    paddingLeft: 16,
  },
  bioAge: {
    color: theme.colors?.white,
    paddingLeft: 20,
  },
  bioAddress: {
    color: theme.colors?.white,
    paddingLeft: 10,
  },
  bioLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
  bioLocation: {
    color: theme.colors?.white,
    paddingLeft: 6,
  },
  iconContainer: {
    paddingLeft: 16,
  },
  bioDetail: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
    paddingTop: 13,
  },
}));

const enum CITY {
  KLU = '基隆市',
  TPE = '台北市',
  TPH = '新北市',
  TYC = '桃園市',
  HSC = '新竹市',
  HSH = '新竹縣',
  MAL = '苗栗縣',
  TXG = '台中市',
  CWH = '彰化縣',
  NTO = '南投縣',
  YLH = '雲林縣',
  CYI = '嘉義市',
  CHI = '嘉義縣',
  TNN = '台南市',
  KHH = '高雄市',
  IUH = '屏東縣',
  TTT = '台東縣',
  HWC = '花蓮市',
  ILN = '宜蘭縣',
  PEH = '澎湖縣',
  KMN = '金門縣',
  LNN = '連江縣',
}

export default function BioInfo(props: { userInfoData?: User & { distance: number } }) {
  const { userInfoData } = props;
  const { theme } = useTheme();
  const styles = useStyles();

  const city = get(CITY, userInfoData?.city, UN_KNOWN);

  return (
    <>
      <View style={[styles.bioTitleContainer,{marginTop:0}]}>
        <TitleOne style={styles.bioName}>{userInfoData?.name}</TitleOne>
        <SubTitleOne style={styles.bioAge}>{calculateAge(userInfoData?.birthday)}</SubTitleOne>
        <SubTitleOne style={styles.bioAddress}>{city}</SubTitleOne>
      </View>
      <View style={styles.bioLocationContainer}>
        {/* <View style={styles.iconContainer}>
          {mapIcon.locationIcon({ color: theme.colors.white })}
        </View>
        <CaptionFour style={styles.bioLocation}>
          {userInfoData?.distance ? `${userInfoData?.distance}km` : UN_RECOGNIZED}
        </CaptionFour> */}
        <View style={styles.iconContainer}>
          {mapIcon.starIcon({ color: theme.colors.white, size: 13 })}
        </View>
        <CaptionFour style={styles.bioLocation}>
          {userInfoData?.starAmount || 0} 人收藏他
        </CaptionFour>
      </View>
      <CaptionFour style={styles.bioDetail}>{userInfoData?.signature || UN_KNOWN}</CaptionFour>
    </>
  );
}
