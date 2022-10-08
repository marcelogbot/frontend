import React, { Fragment } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import useAuth from './service/userAuth';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import RegisterConfirm from './pages/RegisterConfirm';
import UserManage from './pages/UserManage';
import AddUser from './pages/AddUser';
import UpdateRole from './pages/UpdateRole';

const Private = ({ Item }) => {
  const { validToken } = useAuth();
  return validToken > 0 ? <Item /> : <Login />;
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
              <Route path='/register' element={<Register />} />
              <Route path='/registerConfirm' element={<RegisterConfirm />} />
              <Route path='/userManage' element={<Private Item={UserManage}/>} />
              <Route path='/addUser' element={<Private Item={AddUser}/>} />
              <Route path='/updateRole' element={<Private Item={UpdateRole}/>} />
              {/* <Route path='/addUser' element={<AddUser/>} /> */}
            </Routes>
          </Fragment>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;