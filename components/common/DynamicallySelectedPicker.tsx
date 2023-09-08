import React, { createRef, useState } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { ListItem, PickerProps } from '~/types/custom';
import DynamicallySelectedPickerListItem from './DynamicallySelectedPickerListItem';


export default function DynamicallySelectedPicker({
  items = [{ value: 0, label: 'No items', itemColor: 'red' }],
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  width = 300,
  height = 270,
  initialSelectedIndex = 0,
  transparentItemRows = 3,
  allItemsColor = "#FFF",
  fontFamily = 'roboto',
  fontSize,
  selectedItemBorderColor = '#4A4D5A',
}: PickerProps) {
  let itemHeightInitial = height / (transparentItemRows * 2 + 1);
  if (Platform.OS === 'ios') {
    itemHeightInitial = Math.ceil(itemHeightInitial);
  }
  const [itemHeight] = useState<number>(itemHeightInitial);
  const [itemIndex, setItemIndex] = useState<number>(initialSelectedIndex);

  const scrollViewRef = createRef<ScrollView>();

  const scrollToInitialPosition = () => {
    scrollViewRef.current?.scrollTo({
      y: itemHeight * initialSelectedIndex,
    });
  };

  function fakeItems(n = 3) {
    const itemsArr = [];
    for (let i = 0; i < n; i++) {
      itemsArr[i] = {
        value: -1,
        label: '',
      };
    }
    return itemsArr;
  }

  function allItemsLength() {
    return extendedItems().length - transparentItemRows * 2;
  }

  function onScrollListener(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (onScroll != null) {
      const index = getItemIndex(event);
      if (itemIndex !== index && index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScroll({ index });
      }
    }
  }

  function onMomentumScrollBeginListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onMomentumScrollBegin != null) {
      const index = getItemIndex(event);
      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onMomentumScrollBegin({ index });
      }
    }
  }

  function onMomentumScrollEndListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onMomentumScrollEnd != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onMomentumScrollEnd({ index });
      }
    }
  }

  function onScrollBeginDragListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onScrollBeginDrag != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScrollBeginDrag({ index });
      }
    }
  }

  function onScrollEndDragListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onScrollEndDrag != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScrollEndDrag({ index });
      }
    }
  }

  function getItemIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
    return Math.round(event.nativeEvent.contentOffset.y / itemHeight);
  }

  function extendedItems() {
    return [
      ...fakeItems(transparentItemRows),
      ...items,
      ...fakeItems(transparentItemRows),
    ];
  }

  const position = {
    top: 0,
    bottom: 0,
  };

  const border = {
    topWidth: 1,
    bottomWidth: 1,
  };

  return (
    <View style={{ height, width }}>
      <View style={{
      backgroundColor:'#4A4D5A',
      position:'absolute',
      width: "85%",
      alignSelf:'center',
      top:132,
      justifyContent:'flex-end',
      borderRadius:10,
      // bottom: position.bottom,
      height:40,
      marginHorizontal:24
      }}/>
      <ScrollView
        ref={scrollViewRef}
        onLayout={scrollToInitialPosition}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollBegin={onMomentumScrollBeginListener}
        onMomentumScrollEnd={onMomentumScrollEndListener}
        onScrollBeginDrag={onScrollBeginDragListener}
        onScrollEndDrag={onScrollEndDragListener}
        onScroll={onScrollListener}
        scrollEventThrottle={20}
        snapToInterval={itemHeight}
      >
        {extendedItems().map((item: ListItem, index) => {
          return (
            <DynamicallySelectedPickerListItem
              key={index}
              label={item.label}
              fontSize={fontSize ? fontSize : itemHeight / 2}
              fontFamily={fontFamily}
              height={itemHeight}
              itemIndex={itemIndex}
              index={index}
            />
          );
        })}
      </ScrollView>
      {/* <View
        style={[
          styles.gradientWrapper,
          {
            top: border.topWidth,
            borderBottomWidth: border.bottomWidth,
            borderBottomColor: selectedItemBorderColor,
          },
        ]}
        pointerEvents="none"
      >
        <View style={[  styles.pickerGradient,
            {
              height: transparentItemRows * itemHeight,
            },]}/>
      </View> */}
     
      {/* <View
        style={[
          styles.gradientWrapper,
          {
            bottom: position.bottom,
            borderTopWidth: border.topWidth,
            borderTopColor: selectedItemBorderColor,
          },
        ]}
        pointerEvents="none"
      >
        <View style={[  styles.pickerGradient,
            {
              height: transparentItemRows * itemHeight,
            },]}/>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientWrapper: {
    position: 'absolute',
    width: "85%",
    alignSelf:'center'
  },
  pickerGradient: {
    width: '100%',
  },
});
