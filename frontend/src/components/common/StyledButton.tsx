import { cn } from "../../lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type StyledButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function StyledButton({
  children,
  className,
  ...rest
}: StyledButtonProps) {
  const baseStyles = (): string => {
    return "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 border-none hover:cursor-pointer text-sm";
  };

  return (
    <button {...rest} className={cn(baseStyles(), className)}>
      {children}
    </button>
  );
}
