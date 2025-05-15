import { useContext, useState } from "react";
import { Home } from "../pages/public/Home";
import { AuthRoutes } from "./AuthRoutes";




export default function Routes() {
  // const { admin } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  return(
    // !admin.id ? <Login /> : <AuthRoutes />
    // <Teste />
    <AuthRoutes />
  )
}