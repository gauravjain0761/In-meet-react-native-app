import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';

const { width, height } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  progressBarContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  progressBarPink: {
    backgroundColor: theme.colors?.pink,
    width: (width - 24 - 25) / 6,
    height: 6,
    borderRadius: 100,
  },
  progressBarWhite: {
    backgroundColor: theme.colors?.black4,
  },
}));

interface IProgressBar {
  step: number;
}

function LandingProgressBar(props: IProgressBar) {
  const { step } = props;
  const styles = useStyles(props);
  return (
    <View style={styles.progressBarContainer}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={[styles.progressBarPink, step < index + 1 && styles.progressBarWhite]}
          />
        ))}
    </View>
  );
}

export default LandingProgressBar;
