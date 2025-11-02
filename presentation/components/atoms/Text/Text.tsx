import React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "small";
  color?: "primary" | "secondary" | "danger" | "success" | "muted";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export const Text: React.FC<TextProps> = ({
  as: Component = "p",
  variant = "body",
  color = "primary",
  weight,
  className = "",
  children,
  ...props
}) => {
  const variantStyles = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
    body: "text-base",
    caption: "text-sm",
    small: "text-xs",
  };

  const colorStyles = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    danger: "text-red-600",
    success: "text-green-600",
    muted: "text-gray-500",
  };

  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const weightClass = weight ? weightStyles[weight] : "";

  return (
    <Component
      className={`${variantStyles[variant]} ${colorStyles[color]} ${weightClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
