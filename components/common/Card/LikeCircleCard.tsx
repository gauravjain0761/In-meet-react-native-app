import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  cardContainer: {
    alignItems: 'center',
    height: 146,
    width: (width - 32 - 13) / 3,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 100,
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
    fontWeight: '500',
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
  index?: number;
  onClose?: () => void;
}

export default function LikeCircleCard(props: ILikeCard) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { interest, hideLikeIcon, index, onClose } = props;
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
        <View style={[styles.cardContainer, (index + 1) % 3 !== 0 && { marginRight: 20 }]}>
          <Image
            style={styles.cardImage}
            source={{ uri: avatar || `https://picsum.photos/id/231/200/300` }}
          />

          {!hideLikeIcon && (
            <>
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#fff',
                  padding: 0,
                  position: 'absolute',
                  top: 65,
                  right: 15,
                  borderRadius: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                }}>
                <Ionicons name="md-heart" size={23} color="#FF4E84" />
              </View>
              {!isVIP && (
                <BlurView
                  blurAmount={1}
                  blurType="light"
                  style={{
                    width: 40,
                    position: 'absolute',
                    top: 65,
                    right: 15,
                    borderRadius: 20,
                    zIndex: 3,
                    height: 40,
                  }}
                />
              )}
            </>
          )}
          {!isVIP && (
            <BlurView
              style={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
              blurAmount={1}
            />
          )}
          <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }]}>
            <View style={styles.cardIntroContainer}>
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TitleOne style={styles.introText}>{!isVIP ? '升級解鎖' : name}</TitleOne>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#0ACF83',
                      marginLeft: 4,
                    }}
                  />
                </View>
                <Text style={{ color: '#A8ABBD', marginTop: 2 }}>
                  {calculateAge(birthday)}・{CITYEnum[city]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <VIPModal isVisible={openVIP} onClose={() => setOpenVIP(false)} onConfirmCallback={onClose} />
    </>
  );
}
