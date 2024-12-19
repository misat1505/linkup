import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import FormFieldError from "./FormFieldError";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
};

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ error, ...rest }, ref) => {
    return (
      <div className="w-full">
        <Input
          ref={ref}
          className={cn(
            "my-4 w-full border-b-2 border-b-slate-400 bg-transparent p-2 shadow-lg",
            {
              "mb-2 ring-2 ring-red-500 ring-offset-2 focus-visible:ring-red-500":
                error,
            }
          )}
          {...rest}
        />
        {error && <FormFieldError message={error} />}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
