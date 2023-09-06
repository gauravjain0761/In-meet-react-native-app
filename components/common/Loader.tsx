import { View, Text } from 'react-native';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

interface LoaderProps {
  children: any;
  isLoading: boolean;
}

function Loader(props: LoaderProps) {
  const { children, isLoading } = props;
  return (
    <>
      <Spinner visible={isLoading} textContent="Loading..." textStyle={{ color: 'white' }} />
      {children}
    </>
  );
}

export default Loader;
