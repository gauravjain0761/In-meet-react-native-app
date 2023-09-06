import { View, Text, TouchableOpacity, StyleProp } from 'react-native';
import React, { ReactElement } from 'react';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from '../common/Text';
import { UN_FILLED } from '~/constants/defaultValue';

interface IProfileRowItem {
  title: string;
  rightIcon?: ReactElement<any, any>;
  titleStyle: Text['props']['style'];
  descriptionStyle?: Text['props']['style'];
  description?: string;
  onPress: () => void;
}

const useStyles = makeStyles(theme => ({
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
}));

export default function ProfileRowItem(props: IProfileRowItem) {
  const { title, titleStyle, rightIcon, description = '', descriptionStyle = {}, onPress } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
        <SubTitleTwo style={titleStyle}>{title}</SubTitleTwo>
        {Boolean(description) && <SubTitleTwo style={descriptionStyle}>{description}</SubTitleTwo>}
        {rightIcon}
      </TouchableOpacity>

      <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} />
    </View>
  );
}
