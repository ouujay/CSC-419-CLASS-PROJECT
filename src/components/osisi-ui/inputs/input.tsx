import React from "react";
import { Input } from "../../ui/input";
import PasswordInput from "./PasswordInput";

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export default function FormInput({
  label,
  type = "text",
  name,
  placeholder = "",
  className = "",
  value,
  onChange,
  required = true,
  disabled = false,
  maxLength,
  showCharacterCount = false,
}: FormInputProps) {
  const currentLength = value?.length || 0;
  
  return (
    <div className="flex flex-col w-full gap-1">
      <label htmlFor={name} className="flex gap-1 font-light text-xs">
        {label}
        {required ? <span className="text-red-500 text-xs">*</span> : ""}
      </label>
      <Input
        disabled={disabled}
        type={type}
        className={className}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
      {maxLength && showCharacterCount && (
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-light">
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

export function FormInputPassword({
  label,
  name,
  placeholder = "",
  className = "",
  value,
  onChange,
  required = true,
  maxLength,
  showCharacterCount = false,
}: FormInputProps) {
  const currentLength = value?.length || 0;
  
  return (
    <div className="flex flex-col min-w-[250px] w-full gap-1">
      <label htmlFor={name} className="flex gap-1 font-light">
        {label}
        {required ? <span className="text-red-500 text-xs">*</span> : ""}
      </label>
      <PasswordInput
        className={className}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
      {maxLength && showCharacterCount && (
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-light">
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}