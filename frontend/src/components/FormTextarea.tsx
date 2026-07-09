import React from 'react';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  helperText?: string;
  rows?: number;
  disabled?: boolean;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  error,
  register,
  required = false,
  helperText,
  rows = 4,
  disabled = false
}: FormTextareaProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <textarea
        id={name}
        className={`form-textarea ${error ? 'error' : ''}`}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...register}
      />
      {helperText && !error && <p className="form-helper">{helperText}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
