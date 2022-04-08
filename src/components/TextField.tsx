import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
    FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup, InputLeftAddon,
    InputRightAddon
} from '@chakra-ui/react';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { FieldProps, FieldStyles, TextFieldSchema } from '../types';

export const TextField: FC<FieldProps<TextFieldSchema>> = ({
  id,
  name,
  field,
  defaultValue,
}) => {
  const {
    label,
    placeholder,
    htmlInputType,
    helperText,
    isRequired,
    leftInputAddon,
    rightInputAddon,
    shouldDisplay,
    styles = {},
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, watch } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = watch(name);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  return isVisible ? (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!errorMessage}
      {...fieldStyles.control}
    >
      {!!label && (
        <FormLabel htmlFor={name} {...fieldStyles.label}>
          {label}
        </FormLabel>
      )}
      {!!leftInputAddon || rightInputAddon ? (
        <InputGroup {...fieldStyles.inputGroup}>
          {!!leftInputAddon && <InputLeftAddon {...leftInputAddon} />}
          <Input
            data-testid={id}
            type={htmlInputType || 'text'}
            aria-label={name}
            {...register(name)}
            placeholder={placeholder}
            defaultValue={defaultValue || ''}
            {...fieldStyles.input}
          />
          {!!rightInputAddon && <InputRightAddon {...rightInputAddon} />}
        </InputGroup>
      ) : (
        <Input
          data-testid={id}
          type={htmlInputType || 'text'}
          aria-label={name}
          {...register(name)}
          placeholder={placeholder}
          defaultValue={defaultValue || ''}
          {...fieldStyles.input}
        />
      )}
      {!!helperText && (
        <FormHelperText {...fieldStyles.helperText}>
          {helperText}
        </FormHelperText>
      )}
      <FormErrorMessage {...fieldStyles.errorMessage}>
        {errorMessage}
      </FormErrorMessage>
    </FormControl>
  ) : null;
};
