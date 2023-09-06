import { StyleSheet } from 'react-native';

import { useTheme, makeStyles } from '@rneui/themed';
import styledRN from 'styled-components/native';
import styled from 'styled-components';
import { Button, ButtonProps } from '@rneui/base';
import React from 'react';
import { Text, View } from '../../components/Themed';
import { BodyTwo, SubTitleOne } from './Text';

const useStyles = makeStyles(theme => ({
  testWidth: {
    width: '100%',
  },
  type1Text: {
    color: theme.colors?.pink,
  },
  type2Text: {
    color: theme.colors?.white,
  },
  type1Button: {
    backgroundColor: theme.colors?.white,
    borderRadius: 30,
    height: 50,
  },
  type2Button: {
    backgroundColor: theme.colors?.pink,
    borderRadius: 30,
    height: 50,
  },
  chosenButton: {
    backgroundColor: theme.colors?.white,
    borderWidth: 2,
    borderColor: theme.colors?.pink,
    borderRadius: 30,
    height: 50,
    paddingHorizontal:16
  },
  chosenTitle: {
    color: theme.colors?.pink,
    flex:1,
    fontFamily:'roboto',
    fontWeight:'700'
  },
  unChosenButton: {
    backgroundColor: theme.colors?.white,
    borderWidth: 2,
    borderColor: theme.colors?.black4,
    borderRadius: 30,
    height: 50,
    paddingHorizontal:16

  },
  unChosenTitle: {
    color: theme.colors?.black4,
    fontFamily:'roboto',
    fontWeight:'500',
    flex:1,
  },
  typeFourChosenButton: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',

    paddingHorizontal: 30,
  },
  typeFourUnChosenButton: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
  typeFourButton: {
    backgroundColor: theme.colors?.white,
    borderWidth: 1,
    borderColor: theme.colors?.pink,
    borderRadius: 30,
  },
  dollarsText: {
    color: theme.colors?.pink,
  },
  typeFourUnChosenMonthText: {
    color: theme.colors?.black4,
  },
  typeFourUnChosen: {
    borderRadius: 30,
    borderColor: theme.colors?.black5,
    backgroundColor: theme.colors?.black5,
  },
  typeFourUnChosenDollarsText: {
    color: theme.colors?.black3,
    textAlign: 'right',
  },
  likeButtonStyle: {
    backgroundColor: theme.colors?.white,
    padding: 6,
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  chatButtonStyle: {
    backgroundColor: theme.colors?.white,
    padding: 6,
    width: 25,
    height: 25,
    borderRadius: 25,
  },
}));

function IconButton(props: ButtonProps) {
  return <Button {...props} />;
}

function ChatButton(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);
  return <Button {...props} buttonStyle={[styles.chatButtonStyle, buttonStyle]} />;
}

function LikeButton(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);
  return <Button {...props} buttonStyle={[styles.likeButtonStyle, buttonStyle]} />;
}

function ButtonTypeOne(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);

  return (
    <Button
      {...props}
      buttonStyle={[styles.type1Button, buttonStyle]}
      titleStyle={[styles.type1Text, titleStyle]}
    />
  );
}

function ButtonTypeTwo(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);
  return (
    <Button
      {...props}
      buttonStyle={[styles.type2Button, buttonStyle]}
      titleStyle={[styles.type2Text, titleStyle]}
    />
  );
}

function ChosenButton(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);
  return (
    <Button
      {...props}
      buttonStyle={[styles.chosenButton, buttonStyle]}
      titleStyle={[styles.chosenTitle, titleStyle]}
      loadingProps={{ color: 'black' }}
    
    />
  );
}
function UnChosenButton(props: ButtonProps) {
  const { buttonStyle, titleStyle } = props;
  const styles = useStyles(props);
  return (
    <Button
      {...props}
      buttonStyle={[styles.unChosenButton, buttonStyle]}
      titleStyle={[styles.unChosenTitle, titleStyle]}
    />
  );
}

interface IButtonTypeFourProps extends ButtonProps {
  months: any;
  dollars: string;
}
function ButtonTypeFourChosen(props: IButtonTypeFourProps) {
  const { buttonStyle, titleStyle, months, dollars } = props;
  const styles = useStyles(props);

  function CustomView() {
    return (
      <View style={styles.typeFourChosenButton}>
        <BodyTwo>{months}</BodyTwo>
        <SubTitleOne style={styles.dollarsText}>{dollars}</SubTitleOne>
      </View>
    );
  }
  return (
    <Button {...props} title={<CustomView />} buttonStyle={[styles.typeFourButton, buttonStyle]} />
  );
}
function ButtonTypeFourUnChosen(props: IButtonTypeFourProps) {
  const { buttonStyle, months, dollars, titleStyle } = props;
  const styles = useStyles(props);

  function CustomView() {
    return (
      <View style={styles.typeFourUnChosenButton}>
        <BodyTwo style={styles.typeFourUnChosenMonthText}>{months}</BodyTwo>
        <SubTitleOne style={styles.typeFourUnChosenDollarsText}>{dollars}</SubTitleOne>
      </View>
    );
  }
  return (
    <Button
      {...props}
      type="outline"
      title={<CustomView />}
      titleStyle={titleStyle}
      buttonStyle={[styles.typeFourUnChosen, buttonStyle]}
    />
  );
}

export {
  ButtonTypeOne,
  ButtonTypeTwo,
  ChosenButton,
  UnChosenButton,
  ButtonTypeFourChosen,
  ButtonTypeFourUnChosen,
  LikeButton,
  ChatButton,
  IconButton,
};
