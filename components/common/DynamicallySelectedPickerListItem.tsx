import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSize } from '~/helpers/Fonts';
import { PickerListItemProps } from '~/types/custom';


export default function DynamicallySelectedPickerListItem({
  label,
  height,
  fontFamily = 'Arial',
  itemIndex,
  index
}: PickerListItemProps) {
  const colorStyle=(itemIndex+3 == index-1  || itemIndex+3 == index+1) ? "rgba(255, 255, 255, 0.60)" : (itemIndex+3== index -2||itemIndex+3 == index+2) ? "rgba(255, 255, 255, 0.60)" :(itemIndex+3== index -3 ||itemIndex+3 == index+3)? "rgba(255, 255, 255, 0.30)":"#FFF"
  const colorSize=(itemIndex+3== index-1 || itemIndex+3 == index+1)? fontSize(20) :(itemIndex+3== index -2 ||itemIndex+3 == index+2)? fontSize(17)  : (itemIndex+3== index -3 ||itemIndex+3 == index+3)? fontSize(15):fontSize(20) 
  return (
    <View
      style={{
        ...styles.viewWrapper,
        height,
      }}
    >
      <Text
        style={{
          fontSize: colorSize,
          color: colorStyle,
          fontFamily: fontFamily,
        }}
      >
        {label}
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
