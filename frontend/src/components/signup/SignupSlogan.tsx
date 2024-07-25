import React from "react";

export default function SignupSlogan() {
  return (
    <div className="col-span-1 mx-20 flex flex-col justify-center">
      <h1
        className="mt-20 text-center text-9xl font-bold text-white"
        style={{ textShadow: "0 25px 50px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="text-nowrap">Join the</div>
        <div className="text-nowrap">Network</div>
      </h1>
      <p className="mt-32 text-center text-2xl font-semibold">
        Start your journey today and discover a world of connections and
        opportunities.
      </p>
    </div>
  );
}
