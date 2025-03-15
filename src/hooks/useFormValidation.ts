
import { useState } from 'react';

type ValidationRules = {
  required?: boolean;
  minLength?: number;
  email?: boolean;
  match?: string;
};

type FieldValidations<T> = {
  [key in keyof T]?: ValidationRules;
};

type ValidationErrors<T> = {
  [key in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(initialValues: T, validationRules: FieldValidations<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear error when value changes
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    
    validateField(name as keyof T, values[name as keyof T]);
  };

  const validateField = (fieldName: keyof T, value: any): string | undefined => {
    const rules = validationRules[fieldName];
    
    if (!rules) return undefined;
    
    if (rules.required && (value === '' || value === undefined || value === null)) {
      return 'This field is required';
    }
    
    if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    
    if (rules.match && value !== values[rules.match as keyof T]) {
      return 'Fields do not match';
    }
    
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach((fieldName) => {
      const key = fieldName as keyof T;
      const error = validateField(key, values[key]);
      
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    resetForm,
    setValues,
  };
}
