import { useLanguageContext } from "@/providers/language-provider";
import { FormField } from "@packages/ui/components/forms/form-field";
import { useLoginFormContext } from "../providers/login-form-provider";
import { LoginFormType } from "../schemas/auth.validators";

export default function LoginFormFields() {
	const { t } = useLanguageContext();
	const { register, errors } = useLoginFormContext();

	const renderFormField = (name: keyof LoginFormType, placeholder: string, type = "text") => (
		<FormField
			{...register(name)}
			placeholder={placeholder}
			type={type}
			error={errors[name]?.message}
			data-testid={`cy-login-form-${name}`}
		/>
	);

	return (
		<div>
			{renderFormField("login", t("login.form.placeholders.login"))}
			{renderFormField("password", t("login.form.placeholders.password"), "password")}
		</div>
	);
}
