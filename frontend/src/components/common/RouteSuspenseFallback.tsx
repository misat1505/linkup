import React from "react";
import BgGradient from "./BgGradient";
import Loading from "./Loading";

export default function RouteSuspenseFallback() {
  return (
    <BgGradient>
      <Loading />
    </BgGradient>
  );
}
