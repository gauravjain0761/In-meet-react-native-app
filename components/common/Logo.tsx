import { View, Text, Image } from 'react-native';
import React from 'react';
import logo from '../../assets/images/logo/logo.png';

export default function Logo(props: any) {
  return <Image source={logo} {...props} />;
}
