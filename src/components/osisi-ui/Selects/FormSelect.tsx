"use client";
import { cn } from "@/utils/utils";
import { ChevronDown } from "lucide-react"; // you can use any icon
import React, { useState, useCallback, memo } from "react";

export type OptionsType = {
  id: string | number;
  label: string;
  value: string;
};
interface FormSelectProps {
  label?: string;
  name?: string;
  options: OptionsType[];
  placeholder?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

function FormSelectBase({
  label,
  name,
  options,
  placeholder,
  onChange,
  value,
  defaultValue,
  className,
  required = true,
  disabled = false,
}: FormSelectProps) {
  const [isFocused, setIsFocused] = useState(false); // Track focus manually
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className={cn(`flex flex-col w-full gap-1`, className)}>
      <label htmlFor={name} className="flex gap-1 font-light text-xs capitalize">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      <div className="relative w-full">
        <select
          id={name}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(`w-full appearance-none border rounded-lg p-2 pr-10 text-sm bg-background text-foreground font-sora ${
            !value ? "text-foreground/50" : ""
          } ${
            disabled ? " cursor-not-allowed" : ""
          }`)}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron */}
        <ChevronDown
          className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground pointer-events-none transition-transform duration-200 ${
            isFocused ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}

export const FormSelect = memo(FormSelectBase, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.value === nextProps.value &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.options === nextProps.options &&
    prevProps.onChange === nextProps.onChange
  );
});
