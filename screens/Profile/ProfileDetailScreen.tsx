import { View, Text, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { SceneMap, TabBar, TabBarItem, TabView } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import { BodyThree, BodyTwo, CaptionFour } from '../../components/common/Text';
import { UnChosenButton } from '../../components/common/Button';
import ProfileAboutMe from '../../components/Profile/ProfileAboutMe';
import ProfileContactDetail from '../../components/Profile/ProfileContactDetail';
import ProfilePost from '~/components/Profile/ProfilePost';
import ProfilePhoto from '~/components/Profile/ProfilePhoto';
import useCustomHeader from '~/hooks/useCustomHeader';
import { mapIcon } from '~/constants/IconsMapping';
import ProfileAboutDetails from '~/components/Profile/ProfileAboutDetails';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
  },
}));

export default function ProfileDetailScreen(props: RootStackScreenProps<'ProfileDetail'>) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { navigation: navigationProps } = props;
  const navigation = useNavigation();
  const [routes] = React.useState([
    { key: 'first', title: '關於我' },
    { key: 'second', title: '動態' },
    { key: 'third', title: '相簿' },
  ]);
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: styles.headerStyle,
      headerTintColor: theme.colors.white,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerTitle: '個人資料',
      headerLeft: (props) => {
        return (
          <TouchableOpacity onPress={navigation.goBack} style={{}}>
            {mapIcon.backIcon({ size: 28 })}
          </TouchableOpacity>
        );
      },
    });
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black1 }}>
      <ScrollView>

      <ProfileHeader showSignature />
      {/* <ProfileAboutMe navigationProps={navigationProps} /> */}
      <ProfileAboutDetails navigationProps={navigationProps} />
      </ScrollView>
      {/* Description */}
      {/* <TabView
        initialLayout={{ width }}
        renderTabBar={props => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: theme.colors.black1,
              }}
              renderTabBarItem={props => {
                return (
                  <TabBarItem
                    {...props}
                    style={{
                      position: 'relative',
                      zIndex: -1,
                      borderBottomColor: theme.colors.black3,
                      marginLeft: 10,
                      marginRight: 10,
                      borderBottomWidth: 2,
                    }}
                  />
                );
              }}
              contentContainerStyle={{}}
              indicatorContainerStyle={{
                zIndex: 1,
              }}
              indicatorStyle={{
                marginLeft: 10,
                width: (width - 60) / 3,
                backgroundColor: theme.colors.pink,
              }}
            />
          );
        }}
        sceneContainerStyle={{
          // backgroundColor: 'red',
          overflow: 'visible',
        }}
        pagerStyle={
          {
            // backgroundColor: 'blue',
          }
        }
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: () => <ProfileAboutMe navigationProps={navigationProps} />,
          second: () => <ProfilePost />,
          third: () => <ProfilePhoto />,
        })}
        onIndexChange={setIndex}
      /> */}
    </SafeAreaView>
  );
}
