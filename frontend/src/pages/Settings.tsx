import StyledButton from "../components/common/StyledButton";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return <StyledButton onClick={() => navigate("/")}>Home</StyledButton>;
}
