import React from "react";
import StyledButton from "../common/StyledButton";
import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import { ClipLoader } from "react-spinners";

export default function SignupSubmitButton() {
  const { isSubmitting } = useSignupFormContext();

  return (
    <div className="flex justify-center mt-8">
      <StyledButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex gap-x-2 items-center">
            <ClipLoader size={12} color="whitesmoke" />
            <p>Signing up...</p>
          </div>
        ) : (
          <p>Sign up</p>
        )}
      </StyledButton>
    </div>
  );
}
