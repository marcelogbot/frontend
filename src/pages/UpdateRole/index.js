import React, { useEffect, useState, useRef } from 'react';
import Header from './../../component/Header';
import useAuth from '../../service/userAuth';
import { useUserApi } from '../../service/userApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import './updateRole.css';

function UpdateRole() {

  const userApi = useUserApi();
  const { theme, getCredentials } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate(); 
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles ] = useState([]);
  const loadRoles = useRef();
  const loadGetUser = useRef();
  const selectRef = useRef();

  const listRoles = async () => {
    let result = await userApi.listRoles(getCredentials().access_token);
    let listRolesResult = result.data;
    for (let i=0; i<user?.roles?.length; i++) {
      if (listRolesResult.some(item => item.roleID === user.roles[i].roleID)) {
       listRolesResult = listRolesResult.filter(role => role.roleID !== user.roles[i].roleID)
      };                                               
    };
    setRoles(listRolesResult);
  };

  const selectRole = (selected) => {
    var tempArr = [];
    for(let i=0; i<selected.target.length; i++) {
      if(selected.target[i].selected) {
        tempArr.push(selected.target[i].value)
      }
    }
    setSelectedRoles(tempArr);
  };

  const addRoleToUser = async () => {
    let result = "";
    for(let i=0; i<selectedRoles.length; i++) {
      result = await userApi.addRoleToUser(state.username, selectedRoles[i], getCredentials().access_token);
    }
    if (result.status === 200) {
      let updateUser = await userApi.getUser(state.username, getCredentials().access_token);
      setUser(updateUser.data);
      setSelectedRoles([]);
      selectRef.current[0].selected = true;
      await listRoles();
    };   
  };

  const removeRoleToUser = async (roleName) => {
    let result = await userApi.removeRoleToUser(state.username, roleName, getCredentials().access_token);

    if (result.status === 200) {
      let updateUser = await userApi.getUser(state.username, getCredentials().access_token)
      setUser(updateUser.data);
      await listRoles();
    };
  };

  const getUSer = async () => {
    let getUSer = await userApi.getUser(state.username, getCredentials().access_token);
    if (getUSer.status === 200) {
      setUser(getUSer.data);
    }
  };

  loadRoles.current = async () => await listRoles();
  loadGetUser.current = async () => await getUSer();

  useEffect (() => {
    if (user.length === 0) {
      loadGetUser.current();
    }
    selectRef.current[0].selected = true;
    loadRoles.current();
  },[user]);

  return (
    <>
      <Header />
      <div className='updateRole' data-theme={theme}>
        <h1>Gerenciamento de Perfil de Acesso</h1>
        <div className='updateRole_btn'>
          <button onClick={() => navigate('/logedPage')}>Voltar</button>
        </div>
        <div className='updateRole_box'>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <h3>Permissões de: <u>{user?.firstname}</u></h3><br />
            <div className='updateRole_box_select'>
              <p>Permissões disponíveis</p>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <select name='Role_list' onChange={selectRole} ref={selectRef}>
                  <option value={''} disabled={true} style={{padding:5, borderBottom:'solid', textAlign:'center', backgroundColor:'#ccc', fontWeight:'bold', fontSize:14}}>Roles</option>
                  {roles.map((role, idx) => <option key={idx} value={role?.name} style={{padding:5, borderBottom:'solid'}}>{role?.name}</option>)}
                </select>
                <MdAdd title='Adicionar' size={22} onClick={() => addRoleToUser()} style={{marginLeft:10}} />
              </div>
            </div>
          </div>
        </div>
        <div className='updateRole_box_table'>
          <table>
            <thead>
              <tr>
                <th>Permissão</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {user != null &&
                user?.roles?.map((role, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        {role.name}
                      </td>
                      <td>
                        <MdDeleteOutline title='Remover' size={22} color={'red'} onClick={() => removeRoleToUser(role.name)}/>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default UpdateRole;
