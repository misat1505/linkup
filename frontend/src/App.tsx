import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

function App() {
  const API_URL = "http://localhost:5500";
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<any>();

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: loginRef.current!.value,
        password: passwordRef.current!.value,
      }),
      credentials: "include",
    });

    await response.json();
  };

  const fetchUser = async () => {
    const response = await fetch(`${API_URL}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const fetched = await response.json();
    setData(fetched);
  };

  return (
    <div>
      <form>
        <input type="text" placeholder="login" ref={loginRef} />
        <input type="text" placeholder="password" ref={passwordRef} />
        <button onClick={handleLogin}>login</button>
      </form>
      <button onClick={fetchUser}>fetch user</button>
      {data && data.user && (
        <div>
          <div>
            Name: {data.user.firstName} {data.user.lastName}
          </div>
          <Avatar className="w-64 h-64">
            <AvatarImage
              src={`${API_URL}${data.user.photoURL}`}
              className="object-cover"
            />
            <AvatarFallback>
              {data.user.firstName[0].toUpperCase()}
              {data.user.lastName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      {data && data.message && <div>{data.message}</div>}
    </div>
  );
}

export default App;
