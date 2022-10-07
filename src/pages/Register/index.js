import React, {useState,useEffect} from 'react';
import Loading from './../../assets/Loading';
import { useApi } from './../../service/api';
import { useNavigate } from 'react-router-dom';
import RegisterAnimation from '../../assets/RegisterAnimation';
import { MdOutlineWbSunny, MdNightlightRound } from "react-icons/md";
import useAuth from '../../service/userAuth';
import './register.css'

const Register = () => {

    const { theme, switchTheme } = useAuth();
    const navigate = useNavigate();
    const [registerResult, setRegisterResult] = useState(".");
    const [newUser,setNewUser] = useState({firstname:"", lastname:"", username: "", email:"", senha:""});
    const [showLoading, setShowLoading] = useState(false);
    const api = useApi();

    const mudaTema = async () => {
        await switchTheme();
    };

    const inputHandle = (e) => {
        setNewUser({...newUser, [e.target.id]: e.target.value});
    }

    const cadastrar = async () => {
        setRegisterResult(".");
        setShowLoading(true);
        let test = false;
        let camposVazios = "";
        
        if (newUser.firstname === "") {
            camposVazios = "Nome, ";
            test = true;
        }
        if (newUser.username ==="") {
            camposVazios += "Usuário, ";
            test = true;
        }
        if (newUser.email ==="") {
            camposVazios += "Email, ";
            test = true;
        }
        if (newUser.senha ==="") {
            camposVazios += "Senha, ";
            test = true;
        }
        if (test) {
            setShowLoading(false);
            setRegisterResult("Falta(m) preencher: "+ camposVazios);
        } else {

            const result = await api.registration(newUser.firstname, newUser.lastname, newUser.username, newUser.email, newUser.senha)
            setShowLoading(false);
            if (result?.status === 200) {

                navigate("/registerConfirm")
            } else {
                setRegisterResult(result?.response?.status);
            }
        }  
    };

    useEffect(() => {
        //Executa o método cadastrar com a tecla ENTER.
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
              cadastrar();
            }
          };
          document.addEventListener("keydown", listener);
          return () => {
            document.removeEventListener("keydown", listener);
          };

        
    });

    return (
        <div className='register' data-theme={theme}>
            <div className='register-box'>
                <h1>Tela de Registro de Usuário</h1>
                <div>
                    <RegisterAnimation height={180} width={180} />
                </div>
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
            
                    <h3 style={{color: "rgb(173, 90, 90)", opacity:registerResult==="."?0:1}}>{registerResult}</h3>
                    <div className='register-label'>
                        <label>Nome:  </label>
                    </div>
                    <div className='register-input' >
                        <input
                            id='firstname'
                            type='text'
                            placeholder='' 
                            value={newUser.firstname}
                            onChange={(e) => inputHandle(e)}
                        />
                    </div>
                    <div className='register-label'>
                        <label>Sobrenome:  </label>
                    </div>
                    <div className='register-input' >
                        <input
                            id='lastname'
                            type='text'
                            placeholder='' 
                            value={newUser.lastname}
                            onChange={(e) => inputHandle(e)}
                        />
                    </div>
                    <div className='register-label'>
                        <label>E-mail:  </label>
                    </div>
                    <div className='register-input' >
                        <input
                            id='email'
                            type='text'
                            placeholder='' 
                            value={newUser.email}
                            onChange={(e) => inputHandle(e)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <div className='register-label'>
                                <label>Usuário:  </label>
                            </div>
                            <div className='register-input' >
                                <input
                                    id='username'
                                    type='text'
                                    placeholder='' 
                                    value={newUser.username}
                                    onChange={(e) => inputHandle(e)}
                                />
                            </div>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <div className='register-label'>
                                <label>Senha:  </label>
                            </div>
                            <div className='register-input'>
                                
                                <input
                                    id='senha'
                                    type='password'
                                    placeholder=''
                                    value={newUser.senha}
                                    onChange={(e) => inputHandle(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <button id='btn_acessar' style={{marginTop:15}} type='submit' onClick={() => cadastrar()}>
                        Registrar
                    </button>
                    <button id='btn_acessar' style={{marginTop:25}} type='submit' onClick={() => navigate("/")}>
                        Voltar para o login
                    </button>
            </div>
            { (theme==='dark' && 
                <MdOutlineWbSunny onClick={mudaTema} size={22} style={{margin:10}} />) ||
                <MdNightlightRound onClick={mudaTema} size={22} style={{margin:10}} />
            }
        </div>
  )
}

export default Register;
