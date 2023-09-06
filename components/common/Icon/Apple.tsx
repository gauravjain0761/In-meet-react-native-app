import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import apple from '../../../assets/images/icons/Apple.png';
import { IIcon } from './IconType';

export default function Apple(props: IIcon) {
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Image source={apple} />
    </TouchableWithoutFeedback>
  );
}
