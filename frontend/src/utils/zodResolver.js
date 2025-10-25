import { useForm } from 'react-hook-form';

// Zod resolver for react-hook-form
export const zodResolver = (schema) => async (data) => {
  try {
    const values = await schema.parseAsync(data);
    return {
      values,
      errors: {},
    };
  } catch (error) {
    return {
      values: {},
      errors: error.formErrors?.fieldErrors || {},
    };
  }
};
