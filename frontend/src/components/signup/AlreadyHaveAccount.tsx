import { ROUTES } from "../../lib/routes";
import React from "react";
import { Link } from "react-router-dom";

export default function AlreadyHaveAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      Already have an account?{" "}
      <Link className="text-blue-700 underline" to={ROUTES.LOGIN.path}>
        Login
      </Link>
    </p>
  );
}
