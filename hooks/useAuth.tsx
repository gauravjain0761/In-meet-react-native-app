import { View, Text } from 'react-native';
import React, { createContext, useContext, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useAppDispatch } from '~/store';
import { getToken, storeUserToken } from '~/storage/userToken';
import { getUserInfo, patchUserToken } from '~/store/userSlice';

const AuthContext = createContext({});

const useAuth = () => {
  return useContext(AuthContext);
};

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  React.useLayoutEffect(() => {
    const checkLogin = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        if (token) {
          // await dispatch(getUserInfo({ token })).unwrap();
          dispatch(patchUserToken(token));
        }
      } catch (error) {
        await storeUserToken('');
      }

      setIsLoading(false);
    };
    checkLogin();
  }, [dispatch]);

  const memoValue = useMemo(() => {
    return {};
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>;
}

export { AuthProvider };

export default useAuth;
