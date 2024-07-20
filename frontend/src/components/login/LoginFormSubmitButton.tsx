import React from "react";
import StyledButton from "../common/StyledButton";
import { ClipLoader } from "react-spinners";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";

export default function LoginFormSubmitButton() {
  const { isSubmitting } = useLoginFormContext();

  return (
    <div className="mt-4 flex justify-center">
      <StyledButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>Signing in...</p>
          </div>
        ) : (
          <p>Sign in</p>
        )}
      </StyledButton>
    </div>
  );
}
