import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { Options } from 'react-select';

import { FormControl, FormLabel } from '@chakra-ui/react';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../src/components/Form';

export default {
  title: 'Custom Fields',
};

const ReactSelectField = ({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: Options<{ value: string; label: string }>;
}) => {
  const { control } = useFormContext();

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Controller
        render={({ field }) => (
          <Select {...field} placeholder={placeholder} options={options} />
        )}
        name={name}
        control={control}
      />
    </FormControl>
  );
};

const Template: ComponentStory<typeof Form> = () => (
  <Form
    handleSubmit={action('submit')}
    schema={{
      select: {
        type: 'custom',
        //@ts-ignore: incompatible types
        component: ReactSelectField,
        props: {
          label: 'React-Select Field',
          placeholder: 'Select an option',
          options: [
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Option 3', value: 'Option 3' },
          ],
        },
      },
    }}
  />
);

export const ReactSelect = Template.bind({});
