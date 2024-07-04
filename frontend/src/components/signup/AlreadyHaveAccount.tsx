import React from "react";

export default function AlreadyHaveAccount() {
  return (
    <p className="mt-4 text-sm text-center">
      Already have an account?{" "}
      <a className="underline text-blue-700" href="/login">
        Login
      </a>
    </p>
  );
}
