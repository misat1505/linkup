import React from "react";
import { Link } from "react-router-dom";

export default function NoAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      Don&apos;t have an account?{" "}
      <Link className="text-blue-700 underline" to="/signup">
        Signup
      </Link>
    </p>
  );
}
