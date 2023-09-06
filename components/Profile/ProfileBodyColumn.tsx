import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@rneui/themed';
import { CaptionFive, TitleOne } from '../common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import { UnChosenButton } from '../common/Button';

interface IProfileBodyColumn {
  title: string;
  icon: React.ReactElement;
  count: number;
  buttonText: string;
  onPress: () => void;
}

export default function ProfileBodyColumn(props: IProfileBodyColumn) {
  const { title, icon, count, buttonText, onPress } = props;
  const { theme } = useTheme();

  return (
    <View style={{ width: 70 }}>
      <CaptionFive style={{ color: theme.colors.black4, textAlign: 'center', paddingBottom: 5 }}>
        {title}
      </CaptionFive>
      <View style={{ alignItems: 'center', paddingBottom: 7 }}>{icon}</View>
      <TitleOne style={{ textAlign: 'center', paddingBottom: 10, color: theme.colors.white }}>
        {count}
      </TitleOne>

      <UnChosenButton
        buttonStyle={{
          backgroundColor: theme.colors.black4,
          width: '100%',
          height: 20,
          padding: 0,
        }}
        onPress={onPress}
        title={<CaptionFive style={{ color: theme.colors.white }}>{buttonText}</CaptionFive>}
      />
    </View>
  );
}
