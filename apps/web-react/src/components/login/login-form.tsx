import { useLoginFormContext } from "@/contexts/login-form-provider";
import { LoginFormSubmitButton } from "@packages/ui/components/features/login/login-form-submit-button";
import LoginFormFields from "./login-form-fields";

export default function LoginForm() {
	const { submitForm, isSubmitting } = useLoginFormContext();

	return (
		<form onSubmit={submitForm}>
			<LoginFormFields />
			<LoginFormSubmitButton isSubmitting={isSubmitting} />
		</form>
	);
}
