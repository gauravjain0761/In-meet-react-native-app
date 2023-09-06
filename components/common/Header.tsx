import React from 'react';
import { makeStyles } from '@rneui/themed';
import {
  View,
  Text,
  //  SafeAreaView,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import { mapIcon } from '~/constants/IconsMapping';
import { useNavigation } from '@react-navigation/native';
import { ViewProps } from '../Themed';
import { Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors?.black1,
    paddingTop:30,  
  },
  backIcon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  
  titleStyle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors?.white,
    textAlign: 'center',
  },
}));

interface IProgressBar {
  title?:string,
  containerStyle:any
}

function Header(props: IProgressBar) {
  const { title ,containerStyle} = props;
  const {goBack} = useNavigation();

  const styles = useStyles(props);
  return (
    <>
      <SafeAreaView style={[styles.container,containerStyle]} forceInset={{ top: 'always' }}>  
        <TouchableOpacity onPress={() => goBack()}>
          {mapIcon.backIcon()}
        </TouchableOpacity>
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.backIcon} />
      </SafeAreaView>
    </>
  );
}

export default Header;
