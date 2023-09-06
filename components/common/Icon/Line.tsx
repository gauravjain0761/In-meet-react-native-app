import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import line from '../../../assets/images/icons/line.png';
import { IIcon } from './IconType';

export default function Line(props: IIcon) {
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Image source={line} />
    </TouchableWithoutFeedback>
  );
}
