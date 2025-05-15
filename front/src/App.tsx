import React from 'react';
import './assets/reset.css';
import './assets/fonts/fonts.css'
import './assets/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Routes from './routes';
import { UserProvider } from './hooks/contexts/UserContext';
import { SocketProvider } from './hooks/contexts/SocketContext';
import { Loading } from './components/Loading';

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes />
          <ToastContainer 
            autoClose={5000}
            closeOnClick
          />
          <Loading />
        </BrowserRouter>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
