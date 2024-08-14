import React from "react";
import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import { ClipLoader } from "react-spinners";
import { Button } from "../ui/button";

export default function SignupSubmitButton() {
  const { isSubmitting } = useSignupFormContext();

  return (
    <div className="mt-8 flex justify-center">
      <Button variant="blueish" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>Signing up...</p>
          </div>
        ) : (
          <p>Sign up</p>
        )}
      </Button>
    </div>
  );
}
