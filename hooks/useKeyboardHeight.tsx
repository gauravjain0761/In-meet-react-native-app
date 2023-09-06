import { useEffect, useRef, useState } from 'react';
import { EmitterSubscription, Keyboard, Platform } from 'react-native';

const useKeyboardHeight = (platforms: string[] = ['ios', 'android']) => {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const isEventRequired = (platforms: any) => {
    try {
      return (
        platforms?.map((p: string) => p?.toLowerCase()).indexOf(Platform.OS) !== -1 || !platforms
      );
    } catch (ex: any) {}

    return false;
  };

  const keyboardDidShowRef = useRef<EmitterSubscription>();
  const keyboardDidHideRef = useRef<EmitterSubscription>();

  const keyboardDidShow = (frames: any) => {
    setKeyboardHeight(frames.endCoordinates.height);
  };

  const keyboardDidHide = () => {
    setKeyboardHeight(0);
  };
  useEffect(() => {
    if (isEventRequired(platforms)) {
      keyboardDidShowRef.current = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
      keyboardDidHideRef.current = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

      // cleanup function
      return () => {
        Keyboard.removeSubscription(keyboardDidShowRef.current!);
        Keyboard.removeSubscription(keyboardDidHideRef.current!);
      };
    }
    return () => {};
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight;
