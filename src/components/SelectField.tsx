import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Select } from '@chakra-ui/react';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { FieldProps, SelectFieldSchema, SelectFieldStyles } from '../types';

export const SelectField: FC<FieldProps<SelectFieldSchema>> = ({
  id,
  name,
  field,
  defaultValue,
}) => {
  const { label, helperText, isRequired, shouldDisplay, styles = {} } = field;

  const { register, watch } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<SelectFieldStyles>('selectField', styles);

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
      <Select
        data-testid={id}
        {...register(name)}
        defaultValue={defaultValue || field.options[0].value}
        {...fieldStyles.select}
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Select>
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
