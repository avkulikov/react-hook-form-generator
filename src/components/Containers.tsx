import React, { FC, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { AddIcon, DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box, ButtonGroup, Collapse, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    IconButton, Stack, useDisclosure
} from '@chakra-ui/react';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import {
    ArrayFieldSchema, ArrayFieldStyles, Field, FieldProps, ObjectFieldSchema, ObjectFieldStyles
} from '../types';
import { CheckboxField } from './CheckboxField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { SwitchField } from './SwitchField';
import { TextAreaField } from './TextAreaField';
import { TextField } from './TextField';

const renderField = (
  [name, field]: [string, Field],
  id?: string,
  defaultValue?: any
) => {
  let Component: any = null;

  switch (field.type) {
    case 'text':
      Component = TextField;
      break;

    case 'textArea':
      Component = TextAreaField;
      break;

    case 'number':
      Component = NumberField;
      break;

    case 'array':
      Component = ArrayField;
      break;

    case 'object':
      Component = ObjectField;
      break;

    case 'switch':
      Component = SwitchField;
      break;

    case 'checkbox':
      Component = CheckboxField;
      break;

    case 'select':
      Component = SelectField;
      break;

    case 'custom':
      Component = field.component;
      return (
        <Box>
          <Component
            id={id}
            data-testid={id}
            name={name}
            field={field}
            defaultValue={defaultValue}
            {...field.props}
          />
        </Box>
      );

    default:
      break;
  }

  return (
    <Box>
      <Component
        id={id}
        data-testid={id}
        name={name}
        field={field}
        defaultValue={defaultValue}
      />
    </Box>
  );
};

export const arrayFieldStyles: ArrayFieldStyles = {
  arrayContainer: {
    spacing: 4,
    marginTop: 2,
  },
  label: {
    padding: 0,
    display: 'flex',
  },
  countText: {
    fontWeight: 400,
    marginLeft: 1,
  },
  toolbar: {
    alignItems: 'center',
  },
  buttonGroup: {
    marginLeft: 'auto',
  },
  addButton: {
    size: 'xs',
  },
  deleteButton: {
    size: 'xs',
    margin: 'auto',
  },
  clearButton: {
    size: 'xs',
  },
  collapseButton: {
    size: 'xs',
  },
  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2.5rem',
    paddingLeft: 2,
    paddingBottom: 2,
    paddingTop: 1,
    border: '1px solid',
    borderRadius: 4,
    borderColor: 'gray.200',
    backgroundColor: 'gray.50',
  },
  deleteItemContainer: {
    display: 'flex',
  },
};

export const ArrayField: FC<FieldProps<ArrayFieldSchema>> = ({
  name,
  field,
}) => {
  const {
    label,
    isRequired,
    isCollapsable,
    itemField,
    helperText,
    shouldDisplay,
    styles = {},
  } = field;

  const { control, watch } = useFormContext();

  const values = watch(name);

  const { fields, append, remove } = useFieldArray({ name, control });

  const { isOpen, onOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const arrayStyles = useStyles<ArrayFieldStyles>('arrayField', styles);

  const errorMessage = useErrorMessage(name, label);

  const addItem = () => {
    append({});
    onOpen();
  };

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  return isVisible ? (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!errorMessage}
      {...arrayStyles.control}
    >
      <Flex {...arrayStyles.toolbar}>
        {!!label && (
          <FormLabel htmlFor={name} {...arrayStyles.label}>
            {label} <Box {...arrayStyles.countText}>({fields.length})</Box>
          </FormLabel>
        )}
        <ButtonGroup {...arrayStyles.buttonGroup}>
          <IconButton
            icon={<AddIcon />}
            aria-label="Add item"
            onClick={addItem}
            {...arrayStyles.addButton}
          />
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Clear items"
            onClick={() => remove()}
            {...arrayStyles.clearButton}
          />
          {isCollapsable && (
            <IconButton
              icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
              aria-label={isOpen ? 'Hide items' : 'Show items'}
              onClick={onToggle}
              {...arrayStyles.collapseButton}
            />
          )}
        </ButtonGroup>
      </Flex>
      <Collapse in={isOpen}>
        <Stack {...arrayStyles.arrayContainer}>
          {fields.map((item, i) => (
            <Box
              key={item?.id || `${name}[${i}].value`}
              {...arrayStyles.itemContainer}
            >
              {renderField([`${name}[${i}].value`, itemField], item.id)}
              <Box {...arrayStyles.deleteItemContainer}>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete item"
                  onClick={() => remove(i)}
                  {...arrayStyles.deleteButton}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Collapse>
      {!!helperText && (
        <FormHelperText {...arrayStyles.helperText}>
          {helperText}
        </FormHelperText>
      )}
      <FormErrorMessage {...arrayStyles.errorMessage}>
        {errorMessage}
      </FormErrorMessage>
    </FormControl>
  ) : null;
};

export const objectFieldStyles: ObjectFieldStyles = {
  objectContainer: {
    spacing: 4,
    borderWidth: 1,
    borderColor: 'gray.200',
    padding: 2,
    borderRadius: 4,
    marginTop: 2,
    backgroundColor: 'gray.50',
  },
  label: {
    padding: 0,
  },
  toolbar: {
    alignItems: 'center',
  },
  collapseButton: {
    size: 'xs',
    marginLeft: 'auto',
  },
};

export const ObjectField: FC<FieldProps<ObjectFieldSchema>> = ({
  name,
  field,
  id,
  defaultValue,
}) => {
  const {
    label,
    isCollapsable,
    isRequired,
    helperText,
    shouldDisplay,
    styles = {},
  } = field;

  const { watch } = useFormContext();

  const values = watch(name);

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const objectStyles = useStyles<ObjectFieldStyles>('objectField', styles);

  const errorMessage = useErrorMessage(name, field.label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  return isVisible ? (
    <FormControl
      isRequired={!!isRequired}
      isInvalid={!!errorMessage}
      {...objectStyles.control}
    >
      <Flex {...objectStyles.toolbar}>
        {!!label && (
          <FormLabel htmlFor={name} {...objectStyles.label}>
            {label}
          </FormLabel>
        )}
        {isCollapsable && (
          <IconButton
            icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
            aria-label={isOpen ? 'Hide items' : 'Show items'}
            onClick={onToggle}
            {...objectStyles.collapseButton}
          />
        )}
      </Flex>
      <Collapse in={isOpen}>
        <Stack {...objectStyles.objectContainer}>
          {Object.entries(field.properties).map(
            ([fieldName, objectField], i) => (
              <Box key={i} {...objectStyles.propertyContainer}>
                {renderField(
                  [`${name}.${fieldName}`, objectField],
                  id,
                  defaultValue?.[fieldName]
                )}
              </Box>
            )
          )}
        </Stack>
      </Collapse>
      {!!helperText && (
        <FormHelperText {...objectStyles.helperText}>
          {helperText}
        </FormHelperText>
      )}
      <FormErrorMessage {...objectStyles.errorMessage}>
        {errorMessage}
      </FormErrorMessage>
    </FormControl>
  ) : null;
};
