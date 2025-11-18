import { Switch } from "@/components/ui/switch";
import React from "react";

interface FormSwitchProps {
  id: string;
  name: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function FormSwitch({
  id,
  name,
  label,
  checked,
  defaultChecked = true,
  onCheckedChange,
  required = true, 
}: FormSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
            <label htmlFor={name} className="flex gap-1 font-light text-xs">
        {label}
        {required ? <span className="text-red-500 text-xs">*</span> : ""}
      </label>
      <Switch
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange }
      />
    </div>
  );
}
