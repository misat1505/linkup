import React from "react";

export default function NoAccount() {
  return (
    <p className="mt-4 text-sm text-center">
      Don&apos;t have an account?{" "}
      <a className="underline text-blue-700" href="/signup">
        Signup
      </a>
    </p>
  );
}
