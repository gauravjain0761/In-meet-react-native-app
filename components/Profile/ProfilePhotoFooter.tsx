// import { FooterProps } from '@georstat/react-native-image-gallery/lib/typescript/types';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(3, 43, 14,0.5)',
    flexDirection: 'row',
    height: 52,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  text: {
    color: 'white',
  },
});

function Footer({ currentIndex, total }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {currentIndex + 1}/{total}
      </Text>
    </View>
  );
}

export default Footer;
