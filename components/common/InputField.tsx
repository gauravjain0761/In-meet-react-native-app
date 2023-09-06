import {
  View,
  Image,
  Text,
  TextInput,
  Keyboard,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, { ReactElement, useImperativeHandle, useRef, forwardRef } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { ErrorMessage } from '@hookform/error-message';
import { CaptionFour } from './Text';
import { fontSize } from '~/helpers/Fonts';

interface IInputField extends TextInputProps {
  onSubmit?: (data: any) => void;
  name: string;
  rules: any;
  styles?: TextStyle;
  onRightPress?: () => void;
  right?: ReactElement;
  label?: string;
  description?: string;
  required?: boolean;
  containerStyle?:any
}

const useStyles = makeStyles(theme => ({
  iconContainer: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    right: 0,
  },
  inputContainer: {
    position: 'relative',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontFamily:'roboto',
    fontSize:fontSize(14),
    fontWeight:'400'
  },
  description: {
    color: theme.colors.black4,
    marginBottom: 5,
    fontSize: fontSize(12),
  },
}));

type Handle = {
  focus: (() => void) | undefined;
  blur: (() => void) | undefined;
  clear: (() => void) | undefined;
  isFocused: () => boolean | undefined;
};

export default forwardRef<Handle, IInputField>(function InputField(props, ref) {
  const {
    onSubmit,
    keyboardType,
    textContentType,
    placeholder,
    name,
    defaultValue,
    rules,
    styles,
    onRightPress,
    onFocus,
    right,
    label,
    description,
    required,
    containerStyle,
    ...rest
  } = props;
  const inputRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  const classes = useStyles();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef?.current?.focus(),
    blur: () => inputRef?.current?.blur(),
    clear: () => inputRef?.current?.clear(),
    isFocused: () => inputRef?.current?.isFocused(),
  }));
  return (
    <View style={[classes.inputContainer,containerStyle]}>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={classes.inputContainer}>
            {label && (
              <Text style={classes.label}>
                {label}
                {required && <Text style={{ color: theme?.colors?.pink }}>{" *"}</Text>}
              </Text>
            )}
            {description && <Text style={classes.description}>{description}</Text>}
            <TextInput
              value={value}
              {...rest}
              ref={inputRef}
              onFocus={onFocus}
              keyboardType={keyboardType}
              textContentType={textContentType}
              onChangeText={onChange}
              keyboardAppearance="dark"
              placeholder={placeholder}
              onSubmitEditing={onSubmit}
              placeholderTextColor={theme.colors.black4}
              style={{
                borderRadius: 30,
                backgroundColor: theme.colors.black2,
                paddingVertical: 15,
                fontFamily:'roboto',
                fontSize:fontSize(14),
                paddingHorizontal: 20,
                color: theme.colors.white,
                ...(!isEmpty(errors[name]) && {
                  borderColor: theme.colors.pink,
                  borderWidth: 1,
                }),
                ...styles,
              }}
            />
            {right && (
              <View
                style={[
                  classes.iconContainer,
                  { transform: [{ translateX: -12.5 }, { translateY: -12.5 }] },
                ]}>
                <TouchableOpacity onPress={onRightPress}>{right}</TouchableOpacity>
              </View>
            )}
          </View>
        )}
        name={name}
        defaultValue={defaultValue || ''}
      />

      <View style={{ paddingLeft:18, justifyContent: 'center',bottom:5 }}>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message, ...rest }) => (
            <CaptionFour style={{ color: theme.colors.pink, paddingVertical: 8 }}>
              {message}
            </CaptionFour>
          )}
        />
      </View>
    </View>
  );
});
