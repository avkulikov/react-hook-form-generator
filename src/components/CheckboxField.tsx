import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
    Checkbox, FormControl, FormErrorMessage, FormHelperText, FormLabel, Stack
} from '@chakra-ui/react';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { CheckboxFieldSchema, CheckboxFieldStyles, FieldProps } from '../types';

export const checkboxFieldStyles: CheckboxFieldStyles = {
  checkboxGroup: {
    isInline: true,
    spacing: 4,
  },
};

export const CheckboxField: FC<FieldProps<CheckboxFieldSchema>> = ({
  id,
  name,
  field,
}) => {
  const { label, helperText, isRequired, shouldDisplay, styles = {} } = field;

  const { register, watch } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<CheckboxFieldStyles>('checkboxField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  return isVisible ? (
    <FormControl
      key={`${name}-control`}
      isRequired={isRequired}
      isInvalid={!!errorMessage}
      {...fieldStyles.control}
    >
      {!!label && (
        <FormLabel htmlFor={name} {...fieldStyles.label}>
          {label}
        </FormLabel>
      )}
      <Stack {...fieldStyles.checkboxGroup}>
        {field.checkboxes.map((checkbox) => (
          <Checkbox
            key={checkbox.name}
            {...register(checkbox.name)}
            data-testid={`${id}-${checkbox.name}`}
          >
            {checkbox.label || checkbox.name}
          </Checkbox>
        ))}
      </Stack>
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
