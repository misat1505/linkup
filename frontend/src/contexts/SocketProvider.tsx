import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextProps = PropsWithChildren;

type SocketContextValue = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextValue>(
  {} as SocketContextValue
);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: SocketContextProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:5501");
    // console.log("connected");

    // socketIo.on("connect", () => {
    //   console.log("connected");
    // });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
