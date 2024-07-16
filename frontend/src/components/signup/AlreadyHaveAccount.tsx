import React from "react";
import { Link } from "react-router-dom";

export default function AlreadyHaveAccount() {
  return (
    <p className="mt-4 text-sm text-center">
      Already have an account?{" "}
      <Link className="underline text-blue-700" to="/login">
        Login
      </Link>
    </p>
  );
}
