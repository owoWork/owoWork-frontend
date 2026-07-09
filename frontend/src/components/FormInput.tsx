import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  helperText,
  disabled = false
}: FormInputProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <input
        id={name}
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        {...register}
      />
      {helperText && !error && <p className="form-helper">{helperText}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
