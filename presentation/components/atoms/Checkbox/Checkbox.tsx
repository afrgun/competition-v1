import React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const checkboxId = id || "checkbox-" + Math.random().toString(36).substr(2, 9);

  return (
    <div className="w-full">
      <div className="flex items-start">
        <input
          type="checkbox"
          id={checkboxId}
          className={`
            w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded
            focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
