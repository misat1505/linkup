import React from "react";

export default function LoginSlogan() {
  return (
    <div className="col-span-1 mx-20 flex flex-col justify-center">
      <h1
        className="mt-20 text-9xl font-bold text-white"
        style={{ textShadow: "0 25px 50px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="text-nowrap">Welcome to</div>
        <div className="text-nowrap">Link Up</div>
      </h1>
      <p className="mt-32 text-center text-2xl font-semibold">
        Immerse yourself in a social network where connecting with friends,
        sharing your moments, and discovering new communities is just a click
        away.
      </p>
    </div>
  );
}
