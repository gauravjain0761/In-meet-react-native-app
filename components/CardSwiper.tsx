import { isIOS } from '@rneui/base';
import React, {useRef} from 'react';
import {View, StyleSheet, Image, TouchableOpacity,Text, Dimensions} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hp, wp } from '~/helpers/globalFunctions';

interface ViewProps {
  data?: any;
  onSwipePress?: (index: number) => void;
  onSwipeRight?: (data: any) => void;
  onSwipeLeft?: (data: any) => void;
  onDislikePressed?: (ref?: any) => void;
  onLikePressed?: (ref?: any) => void;
  renderCard?: (item: any) => void;
}
const { height, width } = Dimensions.get('window');

const CardSwiper: React.FC<ViewProps> = ({
  data,
  onSwipePress,
  onSwipeRight,
  onSwipeLeft,
  onDislikePressed,
  onLikePressed,
  renderCard,
}) => {
  const useSwiper = useRef<any>(0);

  return (
    <>
        <Swiper
          ref={useSwiper}
          animateCardOpacity={true}
          containerStyle={styles.swiperContainer}
          cards={data}
          renderCard={renderCard}
          cardIndex={0}
          backgroundColor="white"
          stackSize={5}
          verticalSwipe={false}
          infinite={false}
          showSecondCard={true}
        //   stackSeparation={-hp(3.07)}
          animateOverlayLabelsOpacity={true}
          onSwiped={onSwipePress}
          onSwipedRight={onSwipeRight}
          onSwipedLeft={onSwipeLeft}
          swipeBackCard={true}
        />
     
    </>
  );
};

const styles = StyleSheet.create({
  ListConStyle: {
    width: width * 0.93,
    height: height * 0.86,
    backgroundColor: "black",
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  swiperContainer: {
    marginTop: -hp(3.5),
    backgroundColor: 'transparent',
  },
  likeStyle: {
    height: hp(4.1),
    width: wp(9.3),
    // tintColor: colors.blue,
  },
  closeBtnViewStyle: {
    height: wp(17),
    width: wp(17),
    borderRadius: wp(10),
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(33.07),
    shadowColor: "blue",
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    elevation: 14,
  },
  closeStyle: {
    height: hp(3.57),
    width: hp(3.57),
    tintColor: "blue",
  },
  footerViewStyle: {
    marginTop: isIOS ? 0 : hp(2.7),
    flexDirection: 'row',
    
  },
});

export default CardSwiper;
