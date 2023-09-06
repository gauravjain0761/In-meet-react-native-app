import { View, Text, ImageBackground, Dimensions } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme } from '@rneui/themed';
import { BodyThree, CaptionFour, SubTitleTwo, TitleOne } from '../Text';
import { ButtonTypeTwo, LikeButton } from '../Button';
import { mapIcon } from '../../../constants/IconsMapping';
import { IInterest } from '~/store/interestSlice';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  cardContainer: {
    height: 240,
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

interface IInterestCard {
  onPress?: () => void;
  interest: IInterest;
}

export default function InterestCard(props: IInterestCard) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { interest, onPress } = props;

  const { hobbyName, createTime, imageURL, isDisable, id, modifyTime, userCount } = interest;

  const renderInterestName = () => {
    if (hobbyName.length > 4) {
      return `${hobbyName.slice(0, 4)}...`;
    }
    return hobbyName;
  };
  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        style={styles.cardImage}
        source={{ uri: imageURL || `https://picsum.photos/id/231/200/300` }}>
        <LinearGradient
          style={styles.linearGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          locations={[0, 0.5721, 1]}
          colors={['#4A4D5A', 'rgba(74, 77, 90, 0.476938)', 'rgba(74, 77, 90, 0)']}>
          <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }]}>
            <View style={styles.cardIntroContainer}>
              <TitleOne style={styles.introText}>{renderInterestName()}</TitleOne>
              <ButtonTypeTwo
                onPress={onPress}
                buttonStyle={{ width: 50, height: 30 }}
                title={<CaptionFour style={styles.introText}>探索</CaptionFour>}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
