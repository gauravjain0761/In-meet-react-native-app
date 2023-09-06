import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import google from '../../../assets/images/icons/Google.png';
import { IIcon } from './IconType';

export default function Google(props: IIcon) {
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Image source={google} />
    </TouchableWithoutFeedback>
  );
}
