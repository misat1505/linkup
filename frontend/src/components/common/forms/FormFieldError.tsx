type FormFieldErrorProps = {
  message: string;
};

export default function FormFieldError({ message }: FormFieldErrorProps) {
  return <p className="text-sm font-semibold text-red-500">{message}</p>;
}
