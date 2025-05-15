/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";


interface ISocketProvider {
  children: ReactNode
}

export interface ILastBetUser {
  username: string;
  id: number;
  order: number;
  date: Date;
}

export interface IAuction {
  id?: number;
  product: number;
  admin: number;
  winner: number;
  betsUse: number;
  status: "a" | "i" | "e" | "x";
  dateReg?: Date;
  startDate: Date;
  endDate?: Date;
  order?: number;
  name?: string;
  productName: string;
  productPrice?: number;
  last_bet_createdAt?: Date;
  timer?: number;
  image: string;
  lastUsersBet?: ILastBetUser[];
}

interface ISocketProps {
  socket: Socket;
  SendNewBet: Function;
  lastConnectionDate: number;
  AuthenticateUserWebSocket: (token: string) => void;
  LogOffUserWebSocket: () => void;
}

const socket = io(process.env.REACT_APP_SOCKET_URL || '', {
  transports: ['websocket', 'polling', 'flashsocket'],
  reconnection: true,
  autoConnect: true,
  reconnectionAttempts: 100,
  auth: {
    token: "dontHaveInitToken"
  }
});

let reconnectInterval: NodeJS.Timeout

export const SocketContext = createContext({} as ISocketProps);

export function SocketProvider({ children }: ISocketProvider) {
  const [lastConnectionDate, setLastConnectionDate] = useState(0)
  const [socketId, setSocketId] = useState('')
  // --- Authenticated user
  function AuthenticateUserWebSocket(token: string) {
    socket.emit("authentication", token);
  }

  // --- LogOFF
  function LogOffUserWebSocket() {
    socket.emit("logoff", "logoff");
  }

  // --- Send new bet
  function SendNewBet(auction: number) {
    socket.emit("new_bet", {auction: auction}, {headers: {
     
    }});
  }

  useEffect(() => {
    socket.on("error", (message) => {
      toast(String(message), {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    })
    
    socket.on("disconnect", async (message) => {
      // console.log("SOCKET OFF")
      // reconnectInterval = setInterval(() => {
      //   socket.io.connect();
      // }, 1000)
      // socket.removeAllListeners()
    })

    socket.on("connect", async () => {
      // console.log("SOCKET ON", socket.id)
      setSocketId(socket.id)
      // setTimeout(() => setLastConnectionDate(lastConnectionDate + 1), 500)
      if (reconnectInterval) {
        clearInterval(reconnectInterval)
      }
    })

  }, [])

  useEffect(() => {
    setTimeout(() => setLastConnectionDate(lastConnectionDate + 1), 500)
  }, [socketId])

  return (
    <SocketContext.Provider 
      value={{
        socket, 
        SendNewBet, 
        lastConnectionDate,
        AuthenticateUserWebSocket, 
        LogOffUserWebSocket, 
      }}>
      {children}
    </SocketContext.Provider>
  );
}


