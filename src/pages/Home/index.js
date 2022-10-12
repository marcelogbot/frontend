import React, { useEffect, useState } from 'react';
import useAuth from '../../service/userAuth';
import { useNavigate } from 'react-router-dom';
import { MdOutlineWbSunny, MdNightlightRound, MdOutlineClose } from "react-icons/md";
import UserManage from '../UserManage';
import AddUser from '../AddUser';
import UpdateRole from '../UpdateRole';
import './home.css';
import '../../component/Header/header.css';

const TabContent = ({compName, userEdit, userEditRole, onClickEditUSer, onClickEditRole, addUserClick}) => {
    const { user } = useAuth();
    switch(compName) {
        case 'UserManage':
            return <UserManage addUserClick={addUserClick} onClickEditUSer={onClickEditUSer} onClickEditRole={onClickEditRole}/>;
        case 'AddUser':
            return <AddUser user={null}/>;
        case 'EditUser':
            return <AddUser user={userEdit} />; 
        case 'Home':
            return <Home />;
        case 'UpdateRole':
            return <UpdateRole user={userEditRole}/>;
        default:
            return (<div style={{display:'block', height:'90vh', margin:20, justifyContent:'left', color:'var(--text-primary)'}}>
                        <h1>Olá {user?.firstname}!</h1>
                        <p>Bem-vindo ao sistema que estou criando, ainda não sei o que será, mas será algo muito bom.... rs</p>
                    </div>);
    };
};

function Home(props) {
    const { user, signout, theme, switchTheme, tokenValidate  } = useAuth();
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [editUser, setEditUser] = useState({});
    const [editRoleUSer, setEditRoleUser] = useState({});
    const navigate = useNavigate();
    //Pages
    const userManagerTab = ({name:'Lista de usuários', component:'UserManage'});
    const addUserTab = ({name:'Adicionar Usuário', component:'AddUser'});
    const editUserTab = ({name:'Editar Usuário', component:'EditUser'});
    const updateRoleTab = ({name:'Alterar Permissões', component:'UpdateRole'});

    const openTab = (tab) => {
        if(!tabs.some(tabU => tabU.name === tab.name) && tabs.length > 0){
            tabs.push(tab);
        } else if (tabs.length === 0) {
            var firstTab = [tab];
            setTabs(firstTab);
        };

        if(tabs.findIndex(tabsU => tabsU?.name === tab?.name) !== -1) {
            setSelectedTab(tabs.findIndex(tabsU => tabsU?.name === tab?.name));
        } else {
            setSelectedTab(0);
        };
    };

    const closeTab = (idx) => {
        var tmpTabs = tabs.filter((tab, index) => index !== idx);
        setTabs(tmpTabs);

        if (idx === selectedTab && idx >= tmpTabs.length) {
            setSelectedTab(tmpTabs.length-1);
        } else if (selectedTab >= tmpTabs.length || idx < selectedTab) {
            setSelectedTab(selectedTab-1);
        };
    };

    const closeAllTabs = () => {
        var emptyTab = [];
        setTabs(emptyTab);
        setSelectedTab(0);
    }

    const selectTab = (idx) => {
        setSelectedTab(idx);
    };

    const listTabs = (listTabs) => {
       return listTabs.map((tab, idx) => { return (
            <li key={idx} name='tab_list' className={selectedTab===idx?'tab_active':'tab'} title={tab?.name}>
                <div name='tab_name'>
                    <button name='tab_select' onClick={() => selectTab(idx)} >{tab?.name}</button>
                </div>
                <div name='tab_close'>
                    <MdOutlineClose size={16} style={{cursor:'pointer'}} color={'var(--text-primary)'} onClick={() => closeTab(idx)}/>
                </div>
            </li>
        )})
    };

    const Header = () => {
    
        const mudaTema = async () => {
            await switchTheme();
        };
    
        const logout = async () => {
            signout();
            navigate('/');
        };
    
      return (
        <>
            <div className='header' data-theme={theme}>
                <div className='header-left'>
                    <h3>Olá {user!=null? user?.firstname:""}</h3>
                </div>
                <div className='header-right'>
                    <button onClick={() => closeAllTabs()}>Home</button>&nbsp;|&nbsp;
                    {user?.roles.some(role => role.name === 'ROLE_ADMIN')?<><button onClick={() => openTab(userManagerTab)}>Usuários</button>&nbsp;|&nbsp;</>:""}
                    <button onClick={() => logout()}> Sair </button>&nbsp;|&nbsp;
                    { (theme==='dark' && 
                                <MdOutlineWbSunny onClick={mudaTema} size={22} style={{margin:10}} />) ||
                                <MdNightlightRound onClick={mudaTema} size={22} style={{margin:10}} />
                    }
                </div>
            </div>
        </>
      )
    };

    useEffect (() => {
        tokenValidate();

    },[selectedTab])
  
    return (
        <>
            <Header />
            <div className='home' data-theme={theme}>
                <nav className='nav_tabs'>
                    <ul>
                        {listTabs(tabs)}
                    </ul>

                    <div style={{display:'flex', flexDirection:'column', heigth:'100%', width:'100%', padding:2, backgroundColor:'var(--background-input)'}}>
                        <TabContent compName={tabs.length===0?'':tabs[selectedTab]?.component} userEdit={editUser} userEditRole={editRoleUSer}
                                        onClickEditUSer={(userItem) => {setEditUser(userItem); openTab(editUserTab)}}
                                        onClickEditRole={(userItem) => {setEditRoleUser(userItem); openTab(updateRoleTab)}}
                                        addUserClick={() => openTab(addUserTab)}
                                         />
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Home;