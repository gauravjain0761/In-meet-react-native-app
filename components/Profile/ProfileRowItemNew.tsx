import { View, Text, TouchableOpacity, StyleProp } from 'react-native';
import React, { ReactElement } from 'react';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { SubTitleTwo } from '../common/Text';
import { UN_FILLED } from '~/constants/defaultValue';
import { mapIcon } from '~/constants/IconsMapping';

interface IProfileRowItem {
  title: string;
  rightIcon?: ReactElement<any, any>;
  titleStyle: Text['props']['style'];
  descriptionStyle?: Text['props']['style'];
  description?: string;
  onPress: () => void;
  showIcon:boolean
}

const useStyles = makeStyles(theme => ({
  rowContainer: {
    flexDirection: 'row',
    paddingVertical:10,
    paddingHorizontal: 16,
  },
  cardStyle:{}
}));

export default function ProfileRowItemNew(props: IProfileRowItem) {
  const { showIcon,title, titleStyle, rightIcon, description = '', descriptionStyle = {}, onPress } = props;
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.cardStyle}>
      <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
        {showIcon&& rightIcon}
        <SubTitleTwo style={titleStyle}>{title}</SubTitleTwo>
        {Boolean(description) && <SubTitleTwo style={descriptionStyle}>{description}</SubTitleTwo>}
        {mapIcon.arrowDownIcon()}
      </TouchableOpacity>

      {/* <Divider width={2} color={theme.colors.black2} style={{ paddingTop: 20 }} /> */}
    </View>
  );
}
