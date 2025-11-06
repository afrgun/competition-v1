import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

/**
 * Textarea - Atom component for multiline text input
 * Styled for AI chat interface
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`
            bg-gray-800 border border-gray-700 rounded-xl p-4
            w-full min-h-[120px]
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none
            transition-all duration-200
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
