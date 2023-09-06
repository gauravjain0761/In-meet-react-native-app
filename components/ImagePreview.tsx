import { ImagePreviewProps } from '@georstat/react-native-image-gallery/lib/typescript/types';
import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { Dimensions, Image, StyleSheet,TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { mapIcon } from '~/constants/IconsMapping';
import { CaptionFour } from './common/Text';
import { useTheme } from '@rneui/themed';
import { handlePressLike } from './AboutPhotos';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  containerStyle: {
    height,
    width,
    backgroundColor: '#383A44',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlapContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 48 + 20,
    backgroundColor: '#A8ABBD',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    transform: [{ translateX: -25 }],
  },
  text: {
    color: 'white',
    paddingLeft: 10,
  },
});

function ImagePreview({
  index,
  isSelected,
  item,
  renderCustomImage,
  resizeMode,
}: ImagePreviewProps) {
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  return (
    <View>
        <View style={[styles.containerStyle, { height: height - headerHeight - 48 }]}>
          <Image resizeMode={resizeMode} source={{ uri: item.url }} style={styles.image} />
        </View>
    </View>
  );
}

export default ImagePreview;
