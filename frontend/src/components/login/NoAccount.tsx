import React from "react";
import { Link } from "react-router-dom";

export default function NoAccount() {
  return (
    <p className="mt-4 text-sm text-center">
      Don&apos;t have an account?{" "}
      <Link className="underline text-blue-700" to="/signup">
        Signup
      </Link>
    </p>
  );
}
