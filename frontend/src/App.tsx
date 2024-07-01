import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

function App() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default App;
