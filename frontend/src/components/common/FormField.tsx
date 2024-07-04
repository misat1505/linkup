import React from "react";
import { Input } from "../ui/input";

export type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
};

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ error, ...rest }, ref) => {
    return (
      <div className="w-full">
        <Input
          ref={ref}
          className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
            error
              ? "focus-visible:ring-red-500 ring-2 ring-offset-2 mt-4 ring-red-500"
              : ""
          }`}
          {...rest}
        />
        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
