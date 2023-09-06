import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@userToken');
    if (!token) {
      return '';
    }
    return token;
  } catch (error) {
    return '';
  }
};

const storeUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@userToken', token);
  } catch (error) {}
};

const storeUserNotificationShown = async () => {
  try {
    await AsyncStorage.setItem('@notificationModal', 'true');
  } catch (error) {}
};

const clearUserStorage = async () => {
  await AsyncStorage.setItem('@notificationModal', '');
  await AsyncStorage.setItem('@userStep', '');
};

const storeUserIsFromRegistered = async (token: string) => {
  try {
    await AsyncStorage.setItem('@isFromRegistered', token);
  } catch (error) {}
};

const getNotificationHasShown = async () => {
  try {
    const res = await AsyncStorage.getItem('@notificationModal');
    return res;
  } catch (error) {}
};

const getUserIsFromRegistered = async () => {
  try {
    return await AsyncStorage.getItem('@isFromRegistered');
  } catch (error) {}
};

const getIsFirst = async () => {
  try {
    const step = await AsyncStorage.getItem('@userStep');
    switch (step) {
      case 'isFirst':
        return 1;

      case 'isSecond':
        return 2;

      case 'isThird':
        return 3;

      case 'isForth':
        return 4;

      case 'isFifth':
        return 5;
      case 'isDone':
        return -1;
      default:
        return 0;
    }
  } catch (error) {
    return -1;
  }
};

const storeUserIsFirst = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isFirst');
  } catch (error) {}
};
const storeUserIsSecond = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isSecond');
  } catch (error) {}
};
const storeUserIsThird = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isThird');
  } catch (error) {}
};
const storeUserIsFourth = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isForth');
  } catch (error) {}
};
const storeUserIsFifth = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isFifth');
  } catch (error) {}
};
const storeUserIsDone = async () => {
  try {
    await AsyncStorage.setItem('@userStep', 'isDone');
  } catch (error) {}
};

const logout = async () => {
  await storeUserToken('');
};

export {
  getToken,
  storeUserToken,
  getIsFirst,
  storeUserIsFirst,
  storeUserIsSecond,
  storeUserIsThird,
  storeUserIsFourth,
  storeUserIsFifth,
  storeUserIsDone,
  logout,
  getNotificationHasShown,
  storeUserNotificationShown,
  storeUserIsFromRegistered,
  getUserIsFromRegistered,
  clearUserStorage,
};
