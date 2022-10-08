import React, { useEffect, useState, useRef } from 'react'
import { useUserApi } from '../../service/userApi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../service/userAuth';
import { MdRefresh, MdPersonAddAlt1, MdOutlinePersonOff,
        MdOutlinePersonOutline, MdDeleteOutline,
        MdOutlineModeEditOutline, MdManageAccounts } from "react-icons/md";
import Loading from '../../assets/Loading';
import Header from '../../component/Header';
import './logedPage.css'

const LogedPage = () => {
  const api = useUserApi();
  const { getCredentials, user, tokenValidate, theme } = useAuth();
  const navigate = useNavigate();
  const loadListUsers = useRef();
  const [users, setUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const listUsers = async () => {
    setShowLoading(true);
    let userList = await api.listUsers(getCredentials().access_token);
    userList = userList.data.filter(userItem => userItem.username !== user.username);
    userList = userList.sort((a,b) => {
                                        let fa = a?.firstname?.toLowerCase(),
                                        fb = b?.firstname?.toLowerCase();

                                        if (fa < fb) {
                                            return -1;
                                        }
                                        if (fa > fb) {
                                            return 1;
                                        }
                                        return 0;
                                      } 
                                  );
    setUsers(userList);
    await tokenValidate();
    setShowLoading(false);
  }

  const saveNewUser = async () => {
    await tokenValidate();
    navigate('/addUser')
  }

  loadListUsers.current = () => listUsers();

  const removeUser = async (user) => {
    setShowLoading(true);
    let log = await api.deleteUser(user.username, getCredentials().access_token);
    if (log?.status === 200) {
      console.log(log.data);
      loadListUsers.current();
    } else {
      console.log('erro: '+log)
    };
    await tokenValidate();
    setShowLoading(false);
  }

  const enableUser = async (user) => {
    setShowLoading(true);
    let log = await api.enableUser(user.username, getCredentials().access_token);
    if (log?.status === 200) {
      loadListUsers.current();
    } else {
      console.log('Erro: '+ log)
    };
    //await tokenValidate();
    setShowLoading(false);
  }

  useEffect (() => {
    setShowLoading(true);
    loadListUsers.current();
    setShowLoading(false);
    
  },[]);

  return (
    <>
    <Header />
    <div className='logedPage' data-theme={theme}>
      {showLoading &&
                    <>
                        <div style={{position:"absolute",
                                    height:"100%",
                                    width:"100%",
                                    backgroundColor:"#444444",
                                    opacity:0.7,
                                    zIndex:0 }}/>
                        <Loading />
                    </>   
                }
      <div className='logedPage_listUsers'>
        <h2>Gerenciamento de Usuários</h2>
        <div style={{display:'flex', flexDirection:'row', width:'80%', justifyContent:'right'}}>
          <button onClick={listUsers}><MdRefresh size={20}/></button>
          <button onClick={saveNewUser}><MdPersonAddAlt1 size={20}/></button>
        </div>
        <table style={{width:'80%', borderCollapse:'collapse'}}>
          <thead>
          <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Usuário</th>
            <th>Email</th>
            <th>Perfis</th>
          </tr>
          </thead>
          <tbody>
          { (users.length > 0 && users != null)?
            users.map((userItem, idx) => {
              if(userItem?.username !== user?.username) {
              return (
                <tr key={idx}>
                  <td>
                    
                    <MdOutlineModeEditOutline title="Edit user" size={22} onClick={() => navigate('/addUser',{state: userItem})} />
                    &nbsp;
                    <MdManageAccounts title="Edit user" size={22} onClick={() => navigate('/updateRole',{state: userItem})} />
                    &nbsp;
                    {userItem.enabled?<MdOutlinePersonOutline title="User enable" size={22} onClick={() => enableUser(userItem)} style={{marginLeft:5}} />:
                                      <MdOutlinePersonOff title="User disable" color={'#F9AE35'} size={22} onClick={() => enableUser(userItem)} style={{marginLeft:5}} />}
                     &nbsp;
                     <MdDeleteOutline title="Delete user" size={22} color={'red'} onClick={() => removeUser(userItem)} />
                  </td>
                  <td>
                    <b>{userItem.firstname}</b>
                  </td>
                  <td>
                    {userItem.username}
                  </td>
                  <td>
                    {userItem.email}
                  </td> 
                  <td>
                    {userItem.roles.map((role) => "*"+role.name+" ")}
                  </td>
                </tr>
              )} else { return ("")}
            })  : <tr><td colSpan={4} style={{textAlign:'center'}}><b>Sem resultado</b></td></tr> }
            </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default LogedPage;
