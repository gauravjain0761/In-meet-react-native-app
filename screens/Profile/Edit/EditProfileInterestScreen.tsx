import { View, Text, TextInput, Dimensions ,ScrollView} from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import Toast from 'react-native-root-toast';
import useCustomHeader from '~/hooks/useCustomHeader';
import { CaptionFive, SubTitleOne } from '~/components/common/Text';
import { ButtonTypeTwo, UnChosenButton } from '~/components/common/Button';
import { RootState, useAppDispatch } from '~/store';
import { interestApi } from '~/api/UserAPI';
import { patchUserInterests, selectToken, selectUserId, updateUser } from '~/store/userSlice';
import { IInterest } from '~/store/interestSlice';

const { height, width } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    width: (width - 32 - 20) / 2,
    marginBottom: 15,
  },
  chosenButtonText: {
    color: theme.colors?.white,
  },
  unchosenButtonText: {
    color: theme.colors?.black4,
  },
}));
function EditProfileInterestScreen(props) {
  const { navigation } = props;
  const { hobbies = [] } = useSelector((state: RootState) => state.user);
  const token = useSelector(selectToken);
  const styles = useStyles();

  const { theme } = useTheme();
  useCustomHeader({ title: '興趣', navigation });
  const { data } = useQuery(
    'fetchUserByInterest',
    () => interestApi.fetchAllInterest({ token, hobbyName: '', limit: 100 }, {}),
    {
      refetchOnMount: true,
    },
  );
  const userId = useSelector(selectUserId);
  const dispatch = useAppDispatch();

  const [localSelected, setLocalSelected] = useState(
    hobbies?.filter(hobby => !hobby.isDisable) || [],
  );
  const hobbiesIds = localSelected.map(hobby => hobby.id);

  const handleSelectInterest = (record: IInterest) => {
    setLocalSelected(prev => [...prev, record]);
  };

  const handleRemoveSelectedInterest = (record: IInterest) => {
    setLocalSelected(prev => prev.filter(item => item.id !== record.id));
  };

  const handlePatchInterests = async () => {
    try {
      if (hobbiesIds.length === 0) return;
      await dispatch(updateUser({ userId, hobbies: hobbiesIds })).unwrap();
      dispatch(patchUserInterests(localSelected));
      navigation.goBack();
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };
  return (
    
    <View style={{ flex: 1, backgroundColor: theme.colors.black1, paddingTop: 20 }}>
      <ScrollView>
      < View style={styles.buttonContainer}>
        
        {data?.records.map((record, index) =>
          hobbiesIds.includes(record.id) ? (
            <ButtonTypeTwo
              buttonStyle={styles.buttonStyle}
              key={record.id}
              onPress={() => handleRemoveSelectedInterest(record)}
              title={<SubTitleOne style={styles.chosenButtonText}>{record.hobbyName}</SubTitleOne>}
            />
          ) : (
            <UnChosenButton
              buttonStyle={styles.buttonStyle}
              onPress={() => handleSelectInterest(record)}
              key={record.id}
              title={
                <SubTitleOne style={styles.unchosenButtonText}>{record.hobbyName}</SubTitleOne>
              }
            />
          ),
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 16,
        }}>
        <ButtonTypeTwo onPress={handlePatchInterests} title="保存" />
      </View>
      </ScrollView>
    </View>
  );
}

export default EditProfileInterestScreen;
