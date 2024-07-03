import React from "react";
import StyledButton from "../common/StyledButton";
import { ClipLoader } from "react-spinners";

type LoginFormSubmitButtonProps = {
  isSubmitting: boolean;
};

export default function LoginFormSubmitButton({
  isSubmitting,
}: LoginFormSubmitButtonProps) {
  return (
    <div className="flex justify-center mt-4">
      <StyledButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex gap-x-2 items-center">
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
