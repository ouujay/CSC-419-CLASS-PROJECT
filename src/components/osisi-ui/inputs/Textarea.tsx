import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface FormTextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
}

export default function FormTextArea({
  label,
  name,
  placeholder = "",
  className = "",
  value = "",
  onChange,
  required = true,
  disabled = false,
  maxLength = 1000,
  rows = 4,
}: FormTextAreaProps) {
  const currentLength = value?.length || 0;

  return (
    <div className="flex flex-col w-full gap-1">
      <label htmlFor={name} className="flex gap-1 font-light text-xs">
        {label}
        {required ? <span className="text-red-500 text-xs">*</span> : ""}
      </label>
      <Textarea
        disabled={disabled}
        className={className}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        rows={rows}
      />
      <div className="flex justify-end">
        <span className="text-xs font-light">
          {currentLength}/{maxLength}
        </span>
      </div>
    </div>
  );
}
