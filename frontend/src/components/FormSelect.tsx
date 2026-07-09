import React from 'react';

interface FormSelectProps {
  label: string;
  name: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export function FormSelect({
  label,
  name,
  options,
  placeholder = 'Select an option',
  error,
  register,
  required = false,
  helperText,
  disabled = false
}: FormSelectProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <select
        id={name}
        className={`form-select ${error ? 'error' : ''}`}
        disabled={disabled}
        {...register}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helperText && !error && <p className="form-helper">{helperText}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
