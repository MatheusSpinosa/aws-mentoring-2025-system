/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../../service/api";
import { SocketContext } from "./SocketContext";

interface UserContextProvider {
  children: ReactNode
}

export interface IUserLogin {
  token: string
  user: {
    userName: string;
    email: string;
    id: string;
  }
}

interface IHandleUserLogin {
  username: string;
  password: string;
}

interface IContextProps {
  user: IUserLogin;
  handleUserLogin: Function;
  handleUserLogout: Function;
  loading: boolean;
  toggleLoading: Function;
  SendNewBet: Function;
  balance: any;
  getBalance: Function;
}


export const UserContext = createContext({} as IContextProps);

export function UserProvider({ children }: UserContextProvider) {
  const { socket, LogOffUserWebSocket, lastConnectionDate } = useContext(SocketContext);
	const [balance, setBalance] = useState<any>({})

  // --- Global localStorage name
  const localStorageName = "lancesnow@user"
  const localStorageToken = "lancesnow-token"
  const [ user, setUser ] = useState<IUserLogin>({} as IUserLogin);
  const [loading, toggleLoading] = useState(false);


  // --- Check local storage for session
  useEffect(() => {
    const session = localStorage.getItem(localStorageName);
    if (session) {
      const parsed = JSON.parse(session)
      setUser(parsed);
      localStorage.setItem(localStorageName, session);
      sessionStorage.setItem(localStorageToken, parsed.token)
      socket.emit("authentication", parsed.token.split(' ')[1])
    }
  }, []);

  function SendNewBet(auction: number) {
    socket.emit("new_bet", {
      auction: auction, 
    });
  }

  // --- Login user --------------------------------
  async function handleUserLogin({username, password}: IHandleUserLogin) {
    try {
      const response = await api.post("/customer/login", {username: username, password});
      // alert(JSON.stringify(response.data))
      const userData = {
        token: response.data.token,
        user: {...response.data.customer, username: response.data.customer.username},
      }
      setUser(userData);
      localStorage.setItem(localStorageName, JSON.stringify(userData))
      sessionStorage.setItem(localStorageToken, userData.token)

      socket.emit("authentication", response.data.token.split(' ')[1])

    } catch (err: any) {
      console.log(err)
      throw new Error(err.response.data.message);
    }
  }

  // --- Logout user --------------------------------
  function handleUserLogout() {
    localStorage.removeItem(localStorageName);
    sessionStorage.removeItem(localStorageToken)
    LogOffUserWebSocket();
    setUser({} as IUserLogin)
  }

	function getBalance() {
		socket.emit("_balance_", true)
	}

  useEffect(() => {
    // socket.on("unauthenticated", (message) => {
    //   handleUserLogout()
    // })
  }, [])

  // useEffect(() => {
  //   alert(JSON.stringify(user))
  // }, [user])

  useEffect(() => {
    if (user?.user?.id) {
      socket.emit("authentication", user?.token.split(' ')[1])
      const l1 = socket.on("_balance_", (message) => {
        setBalance(message)
      })

      socket.emit("_balance_", true)
      setTimeout(() => {
        socket.emit("_balance_", true)
      }, 3000)

      return () => {
        l1.removeListener()
      }
    }
  }, [user?.user?.id, lastConnectionDate])

	
  return (
    <UserContext.Provider 
      value={{
        user, 
        handleUserLogin, 
        handleUserLogout, 
        loading,
        toggleLoading,
        SendNewBet,
        balance,
        getBalance
      }}>
      {children}
    </UserContext.Provider>
  );
}


