import { Message } from "../../models/Message";
import React from "react";

type ResponseProps = { message: Omit<Message, "response"> };

export default function Response({ message }: ResponseProps) {
  return <div className="bg-black text-white">{message.content}</div>;
}
