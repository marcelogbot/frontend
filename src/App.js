import React, { Fragment } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import useAuth from './service/userAuth';
import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';

const Private = ({ Item }) => {
   const { validToken } = useAuth();
  return  validToken ? <Item /> : <Login />;
};

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Fragment>
            <Routes>
              <Route index element={<Login />} />
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/home' element={<Private Item={Home}/>} />
            </Routes>
          </Fragment>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;