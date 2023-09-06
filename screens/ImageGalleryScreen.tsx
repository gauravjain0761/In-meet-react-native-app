import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';

import { useHeaderHeight } from '@react-navigation/elements';
import { makeStyles, useTheme } from '@rneui/themed';
import { Menu } from 'react-native-paper';
import { get } from 'lodash';
import { mapIcon } from '~/constants/IconsMapping';
import { BodyTwo, CaptionFour } from '~/components/common/Text';
import ImageGallery from '~/components/ImageGallery';

const useStyles = makeStyles(theme => ({
  screen: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
}));

function ImageGalleryScreen({ navigation, route }) {
  const images = get(route, 'params.images', []);
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.screen}>
      <ImageGallery disableSwipe images={images} resizeMode="contain" />
    </View>
  );
}

export default ImageGalleryScreen;
