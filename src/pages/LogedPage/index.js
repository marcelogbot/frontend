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
          <tr style={{textAlign:'center', backgroundColor:'#123456', color:'#eeeeee'}}>
            <th style={{width:'15%' , padding:10}}>Ações</th>
            <th style={{padding:10}}>Nome</th>
            <th style={{padding:10}}>Usuário</th>
            <th style={{padding:10}}>Email</th>
            <th style={{width:'18%', padding:10}}>Perfis</th>
          </tr>
          </thead>
          <tbody>
          { (users.length > 0 && users != null)?
            users.map((userItem, idx) => {
              if(userItem?.username !== user?.username) {
              return (
                <tr key={idx} style={{borderBottomColor:'#333333', borderBottomStyle:'groove', borderWidth:0.1,
                                       backgroundColor:(idx+1 )%2===0?'#eee':'#fff'}}>
                  <td style={{ textAlign:'center', padding:5 }}>
                    
                    <MdOutlineModeEditOutline title="Edit user" size={22} onClick={() => navigate('/addUser',{state: userItem})} />
                    &nbsp;
                    <MdManageAccounts title="Edit user" size={22} onClick={() => navigate('/updateRole',{state: userItem})} />
                    &nbsp;
                    {userItem.enabled?<MdOutlinePersonOutline title="User enable" size={22} onClick={() => enableUser(userItem)} style={{marginLeft:5}} />:
                                      <MdOutlinePersonOff title="User disable" color={'#F9AE35'} size={22} onClick={() => enableUser(userItem)} style={{marginLeft:5}} />}
                     &nbsp;
                     <MdDeleteOutline title="Delete user" size={22} color={'red'} onClick={() => removeUser(userItem)} />
                  </td>
                  <td style={{textAlign:'left', padding:5}}>
                    <b>{userItem.firstname}</b>
                  </td>
                  <td style={{textAlign:'left', padding:5}}>
                    {userItem.username}
                  </td>
                  <td style={{textAlign:'left', padding:5}}>
                    {userItem.email}
                  </td> 
                  <td style={{textAlign:'center', padding:5}}>
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
