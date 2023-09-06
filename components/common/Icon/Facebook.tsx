import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import facebook from '../../../assets/images/icons/Facebook.png';
import { IIcon } from './IconType';

export default function Facebook(props: IIcon) {
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Image source={facebook} />
    </TouchableWithoutFeedback>
  );
}
