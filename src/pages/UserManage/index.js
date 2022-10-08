import React, { useEffect, useState, useRef } from 'react'
import { useUserApi } from '../../service/userApi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../service/userAuth';
import ReactPaginate from 'react-paginate';
import { MdRefresh, MdPersonAddAlt1, MdOutlinePersonOff,
        MdOutlinePersonOutline, MdDeleteOutline,
        MdOutlineModeEditOutline, MdManageAccounts } from "react-icons/md";
import Loading from '../../assets/Loading';
import Modal from '../../component/Modal';
import Header from '../../component/Header';
import './userManage.css'

const UserManage = () => {
  const api = useUserApi();
  const { getCredentials, user, tokenValidate, theme } = useAuth();
  const navigate = useNavigate();
  const loadListUsers = useRef();
  const [users, setUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showMsgResult, setShowMsgResult] = useState(false);
  const [msgModal, setMsgModal] = useState('');

  const [paginateList, setPaginateList] = useState({list:[], perPage:10, page:0, pages:0})

  const listUsers = async () => {
    setShowLoading(true);
    let userList = await api.listUsers(getCredentials().access_token);
    userList = userList.data.filter(userItem => userItem.username !== user.username);
    userList = userList.sort((a,b) => {
                                        let fa = a?.username?.toLowerCase(),
                                            fb = b?.username?.toLowerCase();

                                        if (fa < fb) {
                                            return -1;
                                        }
                                        if (fa > fb) {
                                            return 1;
                                        }
                                        if (fa === fb) {
                                          let la = a?.lastname?.toLowerCase(),
                                              lb = b?.lastname?.toLowerCase();
                                         
                                          if (la < lb) {
                                            return -1;
                                          }
                                          if (la > lb) {
                                            return 1;
                                          }
                                          return 0;
                                        }
                                        return 0;
                                      } 
                                  );
    setUsers(userList);

    let pages = 0
    if(paginateList.perPage <= users.length) {
      pages = Math.ceil(users.length/paginateList.perPage);
    };
    let usersPage = userList.slice(0,paginateList.perPage)
    setPaginateList({...paginateList, pages: pages, list: usersPage})
    await tokenValidate();
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  }

  const saveNewUser = async () => {
    await tokenValidate();
    navigate('/addUser')
  }

  loadListUsers.current = () => listUsers();

  const removeUser = async (user) => {
    let log = await api.deleteUser(user.username, getCredentials().access_token);
    if (log?.status === 200) {
      loadListUsers.current();
    } else {
      console.log('erro: '+ log)
      if (log?.response?.status === 403){
        setMsgModal('Usuário sem permissão!')
        setShowMsgResult(true);
        setTimeout(() => {
          setShowMsgResult(false);
          setMsgModal('')
        },1000)
      }
    };
    await tokenValidate();
  }

  const enableUser = async (user) => {
    let log = await api.enableUser(user.username, getCredentials().access_token);
    if (log?.status === 200) {
      loadListUsers.current();
    } else {
      console.log('Erro: '+ log)
      if (log?.response?.status === 403){
        setMsgModal('Usuário sem permissão!')
        setShowMsgResult(true);
        setTimeout(() => {
          setShowMsgResult(false);
          setMsgModal('')
        },1000)
      }
    };
    await tokenValidate();
  };

  const handlePageClick = (event) => {
    let page = event.selected;

    let start = Math.floor(paginateList.perPage*page);
    if(start > users.length) {
      start = 0;
    };

    let finish = Number(start)+Number(paginateList.perPage);
    if(finish > users.length) {
      finish = users.length;
    };

    let usersPage = users.slice(start,finish);
    setPaginateList({...paginateList, page:page, list:usersPage})

  };

  const setItensPerPage = (select) => {
    let itensPerPage = select.target[select.target.selectedIndex].value;
    let pages = 0
    if(itensPerPage <= users.length) {
      pages = Math.ceil(users.length/itensPerPage);
    };

    let start = Math.floor(itensPerPage*paginateList.page);
    if(start > users.length) {
      start = 0;
    };

    let finish = Number(start)+Number(itensPerPage);
    if(finish > users.length) {
      finish = users.length;
    };

    let usersPage = users.slice(start,finish);

    setPaginateList({...paginateList, perPage: itensPerPage, pages: pages, list: usersPage});  
  };

  const editPerfilUser = (userItem) => {
    if(user.roles.some(role => role.name === 'ROLE_ADMIN')) {
      navigate('/updateRole',{state: userItem})
    } else {
      setMsgModal('Usuário sem permissão!')
      setShowMsgResult(true);
      setTimeout(() => {
        setShowMsgResult(false);
        setMsgModal('')
      },1000);
    };
  };

  const editUser = (userItem) => {
    if(user.roles.some(role => role.name === 'ROLE_ADMIN')) {
      navigate('/addUser',{state: userItem})
    } else {
      setMsgModal('Usuário sem permissão!')
      setShowMsgResult(true);
      setTimeout(() => {
        setShowMsgResult(false);
        setMsgModal('')
      },1000);
    };
  };

  useEffect (() => {

    setShowLoading(true);
    loadListUsers.current();
    setShowLoading(false);
    
  },[]);

  return (
    <>
    <Header />
    {showMsgResult && <Modal message={msgModal} />}
    {showLoading && <Loading /> }
    <div className='userManage' data-theme={theme}>
      <div className='userManage_listUsers'>
        <h2>Gerenciamento de Usuários</h2>
        <div style={{display:'flex', flexDirection:'row', width:'80%', justifyContent:'right'}}>
          <select name='SelectItensPerPage' defaultValue={10} onChange={setItensPerPage}>
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button onClick={listUsers}><MdRefresh size={20}/></button>
          <button onClick={saveNewUser}><MdPersonAddAlt1 size={20}/></button>
        </div>
        <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
          <table style={{width:'80%', borderCollapse:'collapse'}}>
            <thead>
            <tr>
              <th style={{width:'20%'}}>Ações</th>
              <th style={{width:'15%'}}>Nome</th>
              <th style={{width:'15%'}}>Usuário</th>
              <th style={{width:'25%'}}>Email</th>
              <th style={{width:'20%'}}>Perfis</th>
            </tr>
            </thead>
            <tbody>
            { (paginateList.list.length > 0 && paginateList.list != null)?
              paginateList.list.map((userItem, idx) => {
                if(userItem?.username !== user?.username) {
                return (
                  <tr key={idx}>
                    <td>
                      <MdOutlineModeEditOutline title="Edit user" size={22} onClick={() => editUser(userItem)} />
                      &nbsp;
                      <MdManageAccounts title="Edit user" size={22} onClick={() => editPerfilUser(userItem)} />
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
      <div style={{display:'flex', flexDirection:'row'}}>
        {paginateList.pages > 0 &&
          <ReactPaginate
            previousLabel={'<<'}
            nextLabel={'>>'}
            pageCount={paginateList.pages}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
        />}
      </div>
    </div>
    </>
  )
}

export default UserManage;
