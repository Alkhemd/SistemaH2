/**
 * Advanced Form Validation Hook
 * Enterprise-grade form handling with real-time validation
 */

import { useState, useCallback, useEffect } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/lib/logger';

interface ValidationError {
  field: string;
  message: string;
}

interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnSubmit = false,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    async (field: keyof T): Promise<boolean> => {
      try {
        // Validate the entire form to check this field
        await schema.parseAsync(values);

        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });

        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors = error.issues.filter(issue => issue.path[0] === field);
          if (fieldErrors.length > 0) {
            setErrors((prev) => ({
              ...prev,
              [field as string]: fieldErrors[0].message,
            }));
          }
        }
        return false;
      }
    },
    [schema, values]
  );

  /**
   * Validate entire form
   */
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      setIsDirty(true);

      // Validate on change if enabled
      if (validateOnChange && touched[field as string]) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [validateOnChange, touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({
        ...prev,
        [field as string]: true,
      }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate form
      const isFormValid = await validateForm();

      if (!isFormValid) {
        logger.warn('Form validation failed', { errors });
        return;
      }

      // Submit form
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        
        if (resetOnSubmit) {
          resetForm();
        }

        logger.info('Form submitted successfully');
      } catch (error) {
        logger.error('Form submission failed', error as Error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit, resetOnSubmit, errors]
  );

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  }, []);

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: error,
    }));
  }, []);

  /**
   * Set field touched programmatically
   */
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [field as string]: isTouched,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
  };
}

/**
 * Hook for array fields (e.g., dynamic form fields)
 */
export function useFieldArray<T>(
  initialValue: T[] = []
): {
  fields: T[];
  append: (value: T) => void;
  remove: (index: number) => void;
  update: (index: number, value: T) => void;
  move: (from: number, to: number) => void;
  clear: () => void;
} {
  const [fields, setFields] = useState<T[]>(initialValue);

  const append = useCallback((value: T) => {
    setFields((prev) => [...prev, value]);
  }, []);

  const remove = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index: number, value: T) => {
    setFields((prev) => prev.map((item, i) => (i === index ? value : item)));
  }, []);

  const move = useCallback((from: number, to: number) => {
    setFields((prev) => {
      const newFields = [...prev];
      const [removed] = newFields.splice(from, 1);
      newFields.splice(to, 0, removed);
      return newFields;
    });
  }, []);

  const clear = useCallback(() => {
    setFields([]);
  }, []);

  return {
    fields,
    append,
    remove,
    update,
    move,
    clear,
  };
}

/**
 * Hook for form persistence (save to localStorage)
 */
export function useFormPersistence<T>(
  key: string,
  initialValues: T
): [T, (values: T) => void, () => void] {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValues;

    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValues;
    } catch {
      return initialValues;
    }
  });

  const saveValues = useCallback(
    (newValues: T) => {
      setValues(newValues);
      try {
        localStorage.setItem(key, JSON.stringify(newValues));
      } catch (error) {
        logger.error('Failed to save form to localStorage', error as Error);
      }
    },
    [key]
  );

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValues(initialValues);
    } catch (error) {
      logger.error('Failed to clear saved form', error as Error);
    }
  }, [key, initialValues]);

  return [values, saveValues, clearSaved];
}
