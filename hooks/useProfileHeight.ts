import { View, Text } from 'react-native';
import React from 'react';

const useProfileHeight = () => {
  const cityMap = {
    '150以下': '150以下',
    '151-155': '151-155',
    '156-160': '156-160',
    '161-165': '161-165',
    '166-170': '166-170',
    '171-175': '171-175',
    '176-180': '176-180',
    '181-185': '181-185',
    '186-190': '186-190',
    '191-195': '191-195',
    '196-200': '196-200',
    '200以上': '200以上',
  };
  const options = Object.entries(cityMap).map(([cityKey, cityValue]) => ({
    label: cityValue,
    value: cityKey,
  }));

  return [options];
};

export default useProfileHeight;
