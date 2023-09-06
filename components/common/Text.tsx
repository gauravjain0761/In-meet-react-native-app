import { StyleSheet, Text as DefaultText } from 'react-native';

import { makeStyles } from '@rneui/themed';
import { Text, View } from '../../components/Themed';
// import fontFamily from '~/helpers/FontFamily';
import { fontSize } from '~/helpers/Fonts';

const useStyles = makeStyles(theme => ({
  titleOne: {
    color: theme.colors?.black1,
    fontSize: fontSize(28),
    fontWeight: '700',
    fontFamily:"roboto"
  },
  titleTwo: {
    color: theme.colors?.black1,
    fontWeight: '700',
    fontSize: fontSize(20),
    fontFamily:"roboto"
  },
  subTitleOne: {
    color: theme.colors?.black1,
    fontWeight: '500',
    fontSize: fontSize(18),
    fontFamily:"roboto"
  },
  subTitleTwo: {
    color: theme.colors?.black1,
    fontWeight: '500',
    fontSize: 16,
    fontFamily:"roboto"
  },
  bodyOne: {
    color: theme.colors?.black1,
    fontWeight: '500',
    fontSize: fontSize(16),
    fontFamily:"roboto"
  },
  bodyTwo: {
    color: theme.colors?.black1,
    fontWeight: '400',
    fontSize: fontSize(14),
    fontFamily:"roboto"
  },
  bodyThree: {
    color: theme.colors?.black1,
    fontWeight: '500',
    fontSize: fontSize(14),
    fontFamily:"roboto"
  },
  captionFour: {
    color: theme.colors?.black1,
    fontWeight: '500',
    fontSize: fontSize(12),
    fontFamily:"roboto"
  },
  captionFive: {
    color: theme.colors?.black1,
    fontWeight: '300',
    fontSize: fontSize(12),
    fontFamily:"roboto"
  },
  captionSix: {
    color: theme.colors?.black1,
    fontWeight: '300',
    fontSize: fontSize(9),
    fontFamily:"roboto"
  },
}));

export function TitleOne(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.titleOne, props.style]}>
      {props.children}
    </Text>
  );
}

export function TitleTwo(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.titleTwo, props.style]}>
      {props.children}
    </Text>
  );
}
export function SubTitleOne(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.subTitleOne, props.style]}>
      {props.children}
    </Text>
  );
}
export function SubTitleTwo(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.subTitleTwo, props.style]}>
      {props.children}
    </Text>
  );
}
export function BodyOne(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.bodyOne, props.style]}>
      {props.children}
    </Text>
  );
}
export function BodyTwo(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.bodyTwo, props.style]}>
      {props.children}
    </Text>
  );
}
export function BodyThree(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.bodyThree, props.style]}>
      {props.children}
    </Text>
  );
}
export function CaptionFour(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.captionFour, props.style]}>
      {props.children}
    </Text>
  );
}
export function CaptionFive(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.captionFive, props.style]}>
      {props.children}
    </Text>
  );
}

export function CaptionSix(props: DefaultText['props']) {
  const styles = useStyles(props);
  return (
    <Text {...props} style={[styles.captionSix, props.style]}>
      {props.children}
    </Text>
  );
}
