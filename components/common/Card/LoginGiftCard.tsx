import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { makeStyles, Theme, useTheme } from '@rneui/themed';
import { mapIcon } from '../../../constants/IconsMapping';
import { CaptionFour } from '../Text';
interface ILoginProps {
  disabled: boolean;
  likeCount?: number;
  onPress?: () => void;
}

const useStyles = makeStyles((theme, props: ILoginProps) => ({
  giftCardContainer: {
    width: '100%',
    opacity: props?.disabled ? 0.6 : 1,
    borderRadius: 15,
    shadowColor: theme.colors?.black,
    backgroundColor: theme.colors?.white,
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function LoginGiftCard({ disabled, onPress, likeCount = 3 }: ILoginProps) {
  const styles = useStyles({ disabled });
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={{
        width: '100%',
      }}
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.giftCardContainer}>
        {mapIcon['likeIcon']({ color: theme.colors.pink, size: 20 })}
        <CaptionFour>x{likeCount}</CaptionFour>
      </View>
    </TouchableOpacity>
  );
}
