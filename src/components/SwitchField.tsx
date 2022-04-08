import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Switch } from '@chakra-ui/react';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { FieldProps, SwitchFieldSchema, SwitchFieldStyles } from '../types';

export const SwitchField: FC<FieldProps<SwitchFieldSchema>> = ({
  id,
  name,
  field,
}) => {
  const { label, helperText, isRequired, shouldDisplay, styles = {} } = field;

  const { register, watch } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<SwitchFieldStyles>('switchField', styles);

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
      <Switch data-testid={id} {...register(name)} {...fieldStyles.switch} />
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
