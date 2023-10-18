import { View, Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { useSelector } from 'react-redux';
import { TitleOne } from '../Text';
import { ILikeInfo, updateCurrentMatchingId } from '~/store/interestSlice';
import { calculateAge } from '~/helpers/convertDate';
import { CITYEnum } from '~/constants/mappingValue';
import { RootState, useAppDispatch } from '~/store';
import VIPModal from '../VIPModal';
import { fontSize } from '~/helpers/Fonts';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  cardContainer: {
    height: 214,
    width: (width - 32 - 13) / 2,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  linearGradient: {
    height: '27%',
    top: '73%',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  cardIntroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  introText: {
    color: theme.colors?.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bioText: {
    maxWidth: '70%',
    paddingTop: 6,
    color: theme.colors?.white,
  },
  likeButtonContainer: {},
  cardBioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

interface ILikeCard {
  interest: ILikeInfo;
  hideLikeIcon?: boolean;
  isWatched?: boolean;
}

export default function LikeCard(props: ILikeCard) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { interest, hideLikeIcon,isWatched } = props;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { name, avatar, city, birthday, paired_percetage, id } = interest;
  const level = useSelector((state: RootState) => state.user.level);
  const isVIP = level === 'VIP';
  const [openVIP, setOpenVIP] = useState(false);

  const handlePress = () => {
    if (!isVIP) {
      setOpenVIP(true);
    } else if (id) {
      navigation.navigate('MatchingDetailScreen');
      dispatch(updateCurrentMatchingId(id));
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.2}>
        <View style={styles.cardContainer}>
          <ImageBackground
            style={styles.cardImage}
            source={{ uri:   avatar || `https://picsum.photos/id/231/200/300` }}>
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 70,
                height: 23,
                borderRadius: 18,
                backgroundColor: '#4A4D5A99',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: fontSize(10), fontWeight: '500',fontFamily:"roboto" }}>
                {paired_percetage}% MATCH
              </Text>
            </View>
            {/* <LinearGradient
              style={styles.linearGradient}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              locations={[0, 0.5721, 1]}
              colors={['#4A4D5A', 'rgba(74, 77, 90, 0.476938)', 'rgba(74, 77, 90, 0)']}> */}
            <View   style={styles.linearGradient}>
              <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }]}>
                <View style={styles.cardIntroContainer}>
                  <View style={{bottom:20}}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <TitleOne style={styles.introText}>{name}</TitleOne>
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#0ACF83',
                          marginLeft: 2,
                        }}
                      />
                    </View>
                    <Text style={{ color: '#fff',fontFamily:'roboto',fontSize:fontSize(14) }}>
                    {calculateAge(birthday)}・{CITYEnum[city]}
                    </Text>
                  </View>
                  {!hideLikeIcon && (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#fff',
                        padding: 0,
                        borderRadius: 20,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Ionicons name="md-heart" size={23} color="#FF4E84" />
                    </View>
                  )}
                </View>
              </View>
              </View>
            {/* </LinearGradient> */}
          </ImageBackground>
          {!isVIP && (
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              blurAmount={1}
            />
          )}
        </View>
      </TouchableOpacity>
      <VIPModal
        isVisible={openVIP}
        onClose={() => setOpenVIP(false)}
      // onPurchase={() => {
      //   navigation.push('PurchaseHeart');
      //   setChatModal(false);
      // }}
      />
    </>
  );
}
