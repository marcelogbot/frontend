import React, {useState, useEffect} from 'react';
import Loading from '../../assets/Loading';
import Cat from '../../assets/Cat';
import { useApi } from '../../service/api';
import { useUserApi } from '../../service/userApi';
import { MdOutlineMailOutline, MdLockOutline, MdOutlineWbSunny, MdNightlightRound } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../service/userAuth';

import './login.css'

const Login = () => {

    const { setCredentials, validToken, theme, switchTheme } = useAuth();
    const navigate = useNavigate();
    const [login, setLogin] = useState({userName:"", senha:""})
    const [loginResult, setLoginResult] = useState('.');
    const [showLoading, setShowLoading] = useState(false);
    const api = useApi();
    const userApi = useUserApi();

    const mudaTema = async () => {
        await switchTheme();
    };

    const inputHandle = (e) => {
        setLoginResult('.')
        setLogin({...login, [e.target.id]: e.target.value});
    };

    const execLogin = async () => {
        setLoginResult(".");
        setShowLoading(true);
        if (login.userName === "" && login.senha !== "") {
            
            setShowLoading(false);
            setLoginResult("É necessário informar o nome de usuário!");
        
        } else if (login.userName !== "" && login.senha === "") {
        
            setShowLoading(false);
            setLoginResult("É necessário informar a senha!");
        
        } else if (login.userName === "" && login.senha === "") {
        
            setShowLoading(false);
            setLoginResult("Informe o nome de usuário e senha!");
        
        } else {
  
            const result = await api.signin(login.userName, login.senha);
            setShowLoading(false);
           
            if (result?.status === 200) {
                setLoginResult(".");
                let access_token = result.data.access_token;
                let refresh_token = result.data.refresh_token;
                let usernameTemp = JSON.parse(result.data.user).username;
                let getUser = await userApi.getUser(usernameTemp, access_token)
                let user = getUser.data;
               
                setCredentials(access_token, refresh_token, user);
                navigate("/");

           } else if (result?.response?.status === 403) {
                setLoginResult("Usuário ou senha incorreto.");
           } else if (result?.response?.status === 0) {
                setLoginResult("Erro de conexão ao sistema.");  
           } else {
                setLoginResult(result?.response?.status); 
           };       
        };
    };

    useEffect(() => {

        if (validToken) {
            navigate('/home');
        };

        const listener = event => {
            
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                execLogin();
            };
          };

          document.addEventListener("keydown", listener);
          return () => {
            document.removeEventListener("keydown", listener);
          };
    });

    return (
        <div className='login' data-theme={theme}>
            
            <div className='login-box'>

                <div className='login-logo'>
                    <Cat />
                </div>
                
                <h1>Acesso ao Sistema</h1>
                
                {showLoading &&
                    <>
                        <div style={{position:"absolute", height:"100%", width:"100%",backgroundColor:"#444444", opacity:0.7, zIndex:0 }}/>
                        <Loading />
                    </>}
                     
                <h3 style={{color:"rgb(173, 90, 90)", opacity: loginResult==="."?0:1}}>{loginResult}</h3>
                
                <div className='login-input-username' >
                    <MdOutlineMailOutline size={25}/>
                    <input
                        id='userName'
                        type='text'
                        placeholder='Informe seu nome de usuário.'
                        value={login.userName}
                        onChange={(e) => inputHandle(e)}
                    />
                </div>
                
                <div className='login-input-password'>
                    <MdLockOutline size={25}/>
                    <input
                        id='senha'
                        type='password'
                        placeholder='Informe sua senha.'
                        value={login.senha}
                        onChange={(e) => inputHandle(e)}
                    />
                </div>
                
                <button id='btn_acessar' type='submit' onClick={execLogin}>
                    Acessar
                </button>
                
                <h4>Ainda não tem cadastro?</h4>
                <button id='btn_registrar' type='submit' onClick={() => navigate("/register")} >
                    Faça aqui seu cadastrar!
                </button>
                { (theme==='dark' && 
                    <MdOutlineWbSunny onClick={mudaTema} size={22} style={{margin:10}} />) ||
                    <MdNightlightRound onClick={mudaTema} size={22} style={{margin:10}} />
                }
            </div>
        </div>
    );
}

export default Login;