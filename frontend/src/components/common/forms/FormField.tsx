import React from "react";
import { Input } from "../../ui/input";
import FormFieldError from "./FormFieldError";
import { cn } from "../../../lib/utils";

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
            "my-2 w-full border-b-2 border-b-slate-400 bg-transparent p-2",
            {
              "mt-4 ring-2 ring-red-500 ring-offset-2 focus-visible:ring-red-500":
                error
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
