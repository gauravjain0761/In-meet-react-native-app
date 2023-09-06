import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import { BodyTwo, TitleOne } from '../Text';
import ConstellationBackground from '../../../assets/images/ConstellationBackground.png';
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: theme.colors?.white,
    textAlign: 'center',
  },
  bodyText: {
    color: theme.colors?.white,
    textAlign: 'center',
  },
  subTitleColor: {
    color: theme.colors?.black4,
  },
}));

interface IConstellationCard {
  onPress?: () => void;
  title?: string;
  subTitle?: string;
  description?: string;
}
export default function ConstellationCard({
  onPress,
  title = '星座配對',
  subTitle = '探索與你最速配的星座',
  description,
}: IConstellationCard) {
  const styles = useStyles();
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <ImageBackground resizeMode="cover" style={styles.image} source={ConstellationBackground}>
        <TitleOne style={styles.titleText}>{title}</TitleOne>
        <BodyTwo style={[styles.bodyText, description ? styles.subTitleColor : {}]}>
          {description || subTitle}
        </BodyTwo>
      </ImageBackground>
    </TouchableOpacity>
  );
}
