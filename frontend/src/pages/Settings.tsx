import { ROUTES } from "../lib/routes";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <Button variant="blueish" onClick={() => navigate(ROUTES.HOME.path)}>
      Home
    </Button>
  );
}
