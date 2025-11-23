import { useState, useCallback } from 'react';
import { z } from 'zod';

interface FormErrors {
  [key: string]: string | undefined;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodObject<any>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) {
      return true;
    }

    try {
      await validationSchema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const validateField = useCallback(async (name: keyof T) => {
    if (!validationSchema) {
      return true;
    }

    const fieldSchema = (validationSchema as any).shape?.[name];
    if (!fieldSchema) {
      return true;
    }

    try {
      await fieldSchema.parseAsync(values[name]);
      setErrors((prev) => ({ ...prev, [name as string]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message;
        setErrors((prev) => ({ ...prev, [name as string]: message }));
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: any) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const isValid = await validate();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldError = useCallback((name: keyof T): string | undefined => {
    return touched[name as string] ? errors[name as string] : undefined;
  }, [errors, touched]);

  return {
    values,
    errors,
    isSubmitting,
    touched,
    setValue,
    setFieldTouched,
    validate,
    validateField,
    handleSubmit,
    reset,
    getFieldError,
  };
}





