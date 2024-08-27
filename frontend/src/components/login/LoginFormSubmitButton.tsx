import React from "react";
import { ClipLoader } from "react-spinners";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";
import { Button } from "../ui/button";

export default function LoginFormSubmitButton() {
  const { isSubmitting } = useLoginFormContext();

  return (
    <div className="mt-4 flex justify-center">
      <Button
        variant="blueish"
        className="dark:text-white"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>Signing in...</p>
          </div>
        ) : (
          <p>Sign in</p>
        )}
      </Button>
    </div>
  );
}
