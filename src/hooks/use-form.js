import { useMemo } from 'react';
import { Form } from '../classes/form';

export function useForm(handleSubmit, initialValues, validate, onSubmitted) {
  const form = useMemo(() => new Form(handleSubmit, initialValues, validate, onSubmitted), []);
  return form;
}
