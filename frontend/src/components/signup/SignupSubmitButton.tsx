import React from "react";
import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import { ClipLoader } from "react-spinners";
import { Button } from "../ui/button";

export default function SignupSubmitButton() {
  const { isSubmitting, type } = useSignupFormContext();

  const loadingText = type === "create" ? "Signing up..." : "Updating...";
  const text = type === "create" ? "Sign up" : "Update";

  return (
    <div className="mt-8 flex justify-center">
      <Button variant="blueish" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>{loadingText}</p>
          </div>
        ) : (
          <p>{text}</p>
        )}
      </Button>
    </div>
  );
}
