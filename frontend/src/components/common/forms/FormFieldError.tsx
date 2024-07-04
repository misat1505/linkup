import React from "react";

type FormFieldErrorProps = {
  message: string;
};

export default function FormFieldError({ message }: FormFieldErrorProps) {
  return <p className="text-red-500 text-sm font-semibold">{message}</p>;
}
