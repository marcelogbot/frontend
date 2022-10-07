import React from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../service/userAuth';
import { MdOutlineWbSunny, MdNightlightRound } from "react-icons/md";

import './header.css'

function Header() {

    const { user, signout, theme, switchTheme } = useAuth();
    const navigate = useNavigate();

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
            <h3>Olá {user!=null? user?.firstname: ""}</h3>
        </div>
        <div className='header-right'>
            <a href='/logedPage'>Home</a>&nbsp;|&nbsp;
            <a href='/addUser'>Add</a>&nbsp;|&nbsp;
            <a href='/' onClick={() => logout()}> Sair </a>&nbsp;|&nbsp;
            { (theme==='dark' && 
                        <MdOutlineWbSunny onClick={mudaTema} size={22} style={{margin:10}} />) ||
                        <MdNightlightRound onClick={mudaTema    } size={22} style={{margin:10}} />
            }
        </div>
      
    </div>
    </>
  )
}
export default Header;
